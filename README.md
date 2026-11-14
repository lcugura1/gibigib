# GibiGib

Mobile application for digital transformation of GibiGib gym business (Varaždin, Zagreb).

Built as a diploma thesis project at Faculty of Organization and Informatics.

## About

GibiGib enables gym members to purchase memberships, access the gym via QR code,
track attendance, and stay informed about gym news and events — all from a single
mobile application available on iOS and Android.

## Features

| Code | Feature |
|---|---|
| FZ01 | User registration and login |
| FZ02 | Membership program browsing |
| FZ03 | In-app payment |
| FZ04 | QR entry |
| FZ05 | Membership expiry info |
| FZ06 | Attendance tracking |
| FZ07 | News and events |
| FZ08 | Gym info (location, hours, contact) |

## Feature status

Checked on 2026-11-14. "Server verified" means the API behaviour was exercised with scripted requests against a throwaway database (39 checks; the one that looked like a failure, a purchase refused with 409 while a membership was active, is the intended rule; the dev database was not touched) and `pnpm -r typecheck` passes for all five workspaces. The mobile app was **not run on a device or simulator** in this check, so screens are listed as implemented, not as verified. There are no automated tests in the repository.

| Code | Feature | Server | Mobile app | Not confirmed |
|---|---|---|---|---|
| FZ01 | Registration, login, password reset | Verified: register, duplicate rejected, login, wrong password, token refresh rotation, logout, reset code by e-mail (Mailpit) and login with the new password | Screens implemented | App flows on a device |
| FZ02 | Membership program browsing | Programs exist in the database, but the app lists plans from static content (`features/home/data/plans.ts`) | Implemented, static | Prices and plans are not served by the API |
| FZ03 | In-app payment | Rules verified: validation, and a second purchase is refused while a membership is active (409) | PaymentSheet implemented | The Stripe flow end to end (needs test keys and a dev build); not run, to avoid creating objects in the Stripe account |
| FZ04 | QR entry | Verified: 20-digit token, single use, membership and pause checks, anti-passback, every scan logged, door command queued (the 45 s expiry was not re-tested) | Pass screen implemented | **Door hardware**: reader and lock are documented but not tested, see [`docs/hardver`](docs/hardver/README.md) |
| FZ05 | Membership expiry info, pause and resume | Verified: active membership, pause (QR refused while paused), resume | Screens implemented | App flows on a device |
| FZ06 | Attendance tracking | Verified: entry visits, training tags, monthly goal | Implemented. **Flaw:** the screen merges eight hard-coded sample visits (June and July 2026, `attendance/data/visits.ts`) with the real ones | Real data only, until the sample visits are removed |
| FZ07 | News and events | No API | Static content in the app | Content management |
| FZ08 | Gym info (location, hours, contact) | No API | Static content in the app | Content management |

Also implemented in the app: profile avatar (server verified), live occupancy (server verified; an estimate, because exits are not recorded), trainers (static), settings, help and about (static).

## Documentation

Project decisions, what was changed and why, and open questions are kept as HTML pages in [`docs/`](docs/index.html). Open `docs/index.html` in a browser; chapters are in the sidebar.

## Getting started

### Prerequisites

- Node.js 22 or newer
- pnpm 11 (`npm install -g pnpm@11`)
- Docker Desktop (runs the PostgreSQL database)
- For iOS: macOS with Xcode and CocoaPods
- For Android: Android Studio with an emulator or a device with USB debugging

### 1. Install dependencies

```sh
git clone https://github.com/lcugura1/gibigib.git
cd gibigib
pnpm install
```

`pnpm install` also generates the Prisma client.

### 2. Configure the API

```sh
cp apps/api/.env.example apps/api/.env
```

In `apps/api/.env`:

- set `POSTGRES_PASSWORD` and use the same password in `DATABASE_URL`
- set `JWT_SECRET_KEY` to a random value of at least 32 characters, e.g. the output of `openssl rand -base64 48`

### 3. Start the database and the mail catcher

```sh
cd apps/api
docker compose up -d
cd ../..
```

This starts PostgreSQL and [Mailpit](https://mailpit.axllent.org/), which catches the email the API sends (password reset codes). Read it at `http://localhost:8025`. In production, point the `SMTP_*` variables in `.env` at a real mail provider.

### 4. Create the schema and seed data

```sh
pnpm --filter api db:deploy
pnpm --filter api db:seed
```

The seed creates the gym and the membership programs. It creates no users; register an account in the app.

### 5. Run the API

```sh
pnpm dev:api
```

`http://localhost:3000/health` should return `"database": "up"`. If macOS asks whether Node may accept incoming connections, allow it, otherwise the phone cannot reach the API.

### 6. Register the entry scanner

The scanner and the door controller each authenticate with their own device key. A scanner key can only scan and a door key can only poll for door commands. Create them:

```sh
pnpm --filter @gibigib/api device create --kind scanner --name "Varaždin – main entrance scanner"
pnpm --filter @gibigib/api device create --kind door --name "Varaždin – main entrance door"
```

Each key is printed once. Open `http://localhost:3000/scanner/` and paste the scanner key when asked; the page remembers it. The door controller sends its key as `Authorization: Device <key>` when it polls `GET /device/commands`. `device list` shows all devices and `device revoke --id <id>` disables a lost one.

The scanner page also accepts a USB QR reader, which types the code like a keyboard.

#### Hikvision terminal (bridge and simulator)

The Hikvision bridge is being replaced by an Akuvox bridge (decision O-021 in `docs/odluke.html`); the code stays until then. A Hikvision terminal reads the app's QR code as a card number. `apps/bridge` listens to the terminal's events, checks each code with `POST /entry/scan` and opens the door over ISAPI. Without a terminal, run the bundled simulator instead:

```sh
cp apps/bridge/.env.example apps/bridge/.env   # set DEVICE_KEY to a scanner key
pnpm --filter @gibigib/bridge simulator         # fake terminal on http://localhost:8090
pnpm --filter @gibigib/bridge start             # the bridge
```

Open `http://localhost:8090`, show the app's QR code to the camera or type the number, and the page shows the door opening. Hardware docs: `docs/ulaz-hardver.html` and `docs/hardver/`.

### 7. Payments (Stripe, optional)

Memberships are paid with Stripe. Without Stripe keys the API runs, but `/payments` answers 503. With a Stripe account in test mode (no registered business needed), put the test keys from Dashboard → Developers → API keys into `apps/api/.env`, then forward webhooks with the [Stripe CLI](https://docs.stripe.com/stripe-cli):

```sh
stripe listen --forward-to localhost:3000/payments/webhook \n  --events payment_intent.succeeded,payment_intent.payment_failed,payment_intent.canceled,charge.refunded
```

Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET` and restart the API. The test card `4242 4242 4242 4242` with any future date and any CVC succeeds. See `docs/placanje.html`.

### 8. Run the mobile app

The app uses a development build (`expo-dev-client`), so it has to be built and installed once per device:

```sh
cd apps/mobile
npx expo run:ios --device       # iPhone
npx expo run:android --device   # Android
```

For a physical iPhone, the first build also needs:

1. Open `apps/mobile/ios/GibiGib.xcworkspace` in Xcode, select the GibiGib target and choose your team under Signing & Capabilities.
2. On the iPhone, enable Developer Mode (Settings → Privacy & Security).
3. After installing, trust the developer certificate (Settings → General → VPN & Device Management).

After the app is installed, start only the dev server:

```sh
pnpm dev:mobile
```

and open the installed GibiGib app on the device.

The phone and the computer must be on the same Wi-Fi network. The app reaches the API on the dev server's host at port 3000. To point it elsewhere, set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env.local`.

### Useful commands

| Command | Description |
|---|---|
| `pnpm typecheck` | Type-check all packages |
| `pnpm --filter api db:migrate` | Create and apply a new migration after a schema change |
| `pnpm --filter api db:studio` | Browse the database in Prisma Studio |
| `pnpm --filter api device create --kind scanner\|door --name "<name>"` | Create a scanner or door device and print its key |
| `http://localhost:3000/scanner/` | Web QR scanner for testing entry (needs a device key; camera works on `localhost` only) |
| `pnpm --filter @gibigib/bridge simulator` | Fake Hikvision terminal for testing the bridge on `http://localhost:8090` |
