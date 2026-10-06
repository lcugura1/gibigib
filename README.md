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

The scanner and the door controller authenticate with a device key. Create one:

```sh
pnpm --filter @gibigib/api device create --name "Varaždin – main entrance"
```

The key is printed once. Open `http://localhost:3000/scanner/` and paste it when asked; the page remembers it. A door controller sends the same kind of key as `Authorization: Device <key>` when it polls `GET /device/commands`. `device list` shows all devices and `device revoke --id <id>` disables a lost one.

### 7. Run the mobile app

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
| `pnpm --filter api device create --name "<name>"` | Create a scanner or door device and print its key |
| `http://localhost:3000/scanner/` | Web QR scanner for testing entry (needs a device key; camera works on `localhost` only) |
