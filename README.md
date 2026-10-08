# Doyrai

**Plan it. Do it. Repeat.**

Doyrai is a personal Task & Habit Manager built with Next.js (App Router), Tailwind CSS, Firebase Auth, and Firestore. It feels like a native app on phones (PWA + bottom tabs) and a polished dashboard on desktop.

## Local setup

```bash
cd doyra
npm install
cp .env.example .env.local
# Fill in Firebase web config values in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires **Node.js 20+**.

## Environment variables

Copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-flash-lite-latest
```

The Firebase values are the **web client** config values (Project settings → Your apps). `GEMINI_API_KEY` is server-only and is used by the Gym trainer route; never prefix it with `NEXT_PUBLIC_` or commit its value.

## Firebase console checklist

1. Create (or open) your Firebase project (Spark free plan is fine).
2. **Authentication → Sign-in method**
   - Enable **Email/Password**
   - Enable **Google**
3. **Authentication → Settings → Authorized domains**
   - Add `localhost` (usually present)
   - Add your Vercel domain (e.g. `your-app.vercel.app`) and custom domain if any
4. **Firestore Database**
   - Create a Firestore database
   - Deploy rules from `firestore.rules` (users can only read/write their own `/users/{uid}/**` docs)
5. Do **not** enable Cloud Storage or Analytics for this app — not used.

## Vercel deployment

1. Import [hiteshebrandz/doyra](https://github.com/hiteshebrandz/doyra) in [Vercel](https://vercel.com) (root directory = repo root).
2. Firebase web config is already in committed `.env.production` (safe for `NEXT_PUBLIC_*` client keys). Vercel will pick it up on build. You can still override the same keys under **Project → Settings → Environment Variables** if you prefer.
3. Deploy, then in Firebase **Authentication → Settings → Authorized domains** add your Vercel domain (e.g. `your-app.vercel.app`).
4. After deploy, open the site, sign up, and install as a PWA from the browser menu if desired.

Do **not** commit `.env.local` — that stays on your machine for local `npm run dev`.

## Read / write optimization strategy

Firestore bills per document read and write. Doyrai is designed to stay far under the free tier for normal daily use (**target ~15 reads / ~30 writes per day**).

### Few documents, not one-per-item

| Path | Contents |
|------|----------|
| `users/{uid}/meta/settings` | theme, displayName, weekStart |
| `users/{uid}/meta/habits` | `{ items: Habit[] }` |
| `users/{uid}/tasks/active` | `{ items: { [id]: Task } }` |
| `users/{uid}/tasks/archive_YYYY-MM` | completed tasks older than 30 days |
| `users/{uid}/logs/YYYY-MM` | `{ days: { "01": { [habitId]: true } } }` |

### Rules of the data layer

- **Initial load ≤ 4 reads:** settings, habits, `tasks/active`, current month log. Other months load only when navigated.
- **`getDoc` only** — no `onSnapshot`, no polling.
- **In-memory Zustand store** is the session source of truth; UI never reads Firestore directly after hydrate.
- **Optimistic updates** + **~1s debounced coalesce** so each document is written at most once per flush.
- Field-path updates (`items.<id>`, `days.<dd>.<habitId>`) — never rewrite a whole document for one change.
- Flush on `visibilitychange` / `pagehide` / `beforeunload`.
- Habit check-in = one tiny update on that month’s log doc.
- Completed tasks older than 30 days rotate to monthly archive docs (guards the **1 MiB** document limit).
- Persistent local cache (`persistentLocalCache` + `persistentMultipleTabManager`) serves repeat loads from the browser when possible.
- Dev-only usage logger: watch the console for `[doyra:usage]` read/write counts.

### Backup

Settings → **Export JSON** / **Import JSON** is the backup and restore path (batched write on import).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Stack

Next.js · TypeScript · Tailwind CSS · next-themes · Framer Motion · Lucide · Firebase JS SDK · Zustand · Recharts (lazy) · PWA manifest
