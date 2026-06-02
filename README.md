# GibiGib

Mobile application for digital transformation of GibiGib gym business (Varaždin, Zagreb).

Built as a diploma thesis project at Faculty of Organization and Informatics.

## About

GibiGib enables gym members to purchase memberships, access the gym via barcode,
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

## License

Private — diploma thesis project.

```
gibigib
├─ README.md
├─ apps
│  ├─ api
│  │  ├─ package.json
│  │  ├─ prisma
│  │  │  └─ migrations
│  │  └─ src
│  │     ├─ controllers
│  │     ├─ middleware
│  │     ├─ routes
│  │     ├─ services
│  │     └─ utils
│  └─ mobile
│     ├─ .claude
│     │  └─ settings.json
│     ├─ AGENTS.md
│     ├─ App.tsx
│     ├─ LICENSE
│     ├─ app.json
│     ├─ assets
│     │  ├─ android-icon-background.png
│     │  ├─ android-icon-foreground.png
│     │  ├─ android-icon-monochrome.png
│     │  ├─ favicon.png
│     │  ├─ icon.png
│     │  └─ splash-icon.png
│     ├─ features
│     │  ├─ attendance
│     │  │  ├─ __tests__
│     │  │  ├─ components
│     │  │  ├─ hooks
│     │  │  ├─ screens
│     │  │  ├─ services
│     │  │  └─ types
│     │  ├─ auth
│     │  │  ├─ __tests__
│     │  │  ├─ components
│     │  │  ├─ hooks
│     │  │  ├─ screens
│     │  │  ├─ services
│     │  │  └─ types
│     │  ├─ barcode
│     │  │  ├─ __tests__
│     │  │  ├─ components
│     │  │  ├─ hooks
│     │  │  ├─ screens
│     │  │  ├─ services
│     │  │  └─ types
│     │  ├─ info
│     │  │  ├─ __tests__
│     │  │  ├─ components
│     │  │  ├─ hooks
│     │  │  ├─ screens
│     │  │  ├─ services
│     │  │  └─ types
│     │  ├─ membership
│     │  │  ├─ __tests__
│     │  │  ├─ components
│     │  │  ├─ hooks
│     │  │  ├─ screens
│     │  │  ├─ services
│     │  │  └─ types
│     │  └─ news
│     │     ├─ __tests__
│     │     ├─ components
│     │     ├─ hooks
│     │     ├─ screens
│     │     ├─ services
│     │     └─ types
│     ├─ index.ts
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ shared
│     │  ├─ components
│     │  │  └─ ui
│     │  ├─ constants
│     │  ├─ hooks
│     │  └─ utils
│     └─ tsconfig.json
├─ package.json
├─ packages
│  └─ types
│     ├─ package.json
│     └─ src
├─ pnpm-lock.yaml
└─ pnpm-workspace.yaml

```