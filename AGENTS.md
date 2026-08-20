# AGENTS.md

Overview of the project structure for developers and AI agents working on this codebase.

## Project Overview

League of Bums is a fantasy football league site: 2026 season hub (power rankings, matchups,
weekly previews), the ManeyCast podcast (Google Drive video embeds), league history (past
winners, trades, team histories), awards, and team/manager profiles. Content is managed through
a password-protected admin dashboard rather than a public CMS or user accounts.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 (CSS-first `@theme` tokens) |
| Database | Netlify Database (Postgres) via Drizzle ORM |
| Auth | TanStack Start sealed session cookie (simple admin password gate) |
| Language | TypeScript 5.7 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
├── db
│   ├── index.ts          # Drizzle client (drizzle-orm/netlify-db)
│   └── schema.ts         # All table definitions
├── drizzle.config.ts     # drizzle-kit config, migrations out to netlify/database/migrations
├── netlify/database/migrations/  # Generated + hand-authored SQL migrations (applied by Netlify at deploy)
├── src
│   ├── components
│   │   ├── admin/        # CRUD form/list components for the admin dashboard, one per data domain
│   │   ├── NavBar.tsx, Footer.tsx, PageHero.tsx
│   ├── lib
│   │   ├── session.ts    # Admin session config + login/logout helpers
│   │   └── auth.ts       # Server functions (adminLogin/adminLogout/getIsAdmin) + requireAdminMiddleware
│   ├── server
│   │   ├── teams.functions.ts     # Team/manager profile CRUD
│   │   ├── season.functions.ts    # Power rankings, matchups, weekly previews CRUD
│   │   ├── podcast.functions.ts   # ManeyCast episode CRUD
│   │   ├── history.functions.ts   # Trades, champions, team history CRUD
│   │   └── awards.functions.ts    # Awards CRUD
│   ├── routes
│   │   ├── __root.tsx     # Root layout: NavBar, Footer, grain overlay
│   │   ├── index.tsx      # Homepage
│   │   ├── season.tsx, podcast.tsx, history.tsx, awards.tsx
│   │   ├── teams/index.tsx, teams/$teamSlug.tsx
│   │   └── admin/login.tsx, admin/index.tsx  # Password gate + CRUD dashboard
│   └── styles.css         # Tailwind v4 `@theme` tokens (colors, fonts) + grain overlay
├── netlify.toml
└── tsconfig.json          # `@/*` alias → `./src/*`
```

## Key Concepts

### Data layer

All persistent data lives in Netlify Database (Postgres), accessed only through Drizzle ORM
(`db/index.ts`). Schema changes go in `db/schema.ts` plus a generated migration
(`npx drizzle-kit generate`) — migrations are immutable once created and applied automatically
by Netlify at deploy time; never hand-edit an already-generated migration or run migrations
manually.

### Server functions

Each domain has a `*.functions.ts` file under `src/server/` with `createServerFn` handlers:
unauthenticated `GET` reads, and `POST` writes wrapped in `requireAdminMiddleware`. Route loaders
call these server functions (never the DB directly) so data fetching works both on the server and
during client-side navigation.

### Admin auth

`src/lib/session.ts` defines a sealed session cookie (`lob_admin_session`) using TanStack Start's
built-in `getSession`/`updateSession`/`clearSession`. `loginAdmin` checks the submitted password
against `process.env.ADMIN_PASSWORD`. `requireAdminMiddleware` (in `src/lib/auth.ts`) guards every
mutating server function, and `/admin`'s route `beforeLoad` redirects to `/admin/login` when
`getIsAdmin()` returns false. This is intentionally a single shared admin password, not per-user
accounts.

## Conventions

- Components: PascalCase. Server function files: `<domain>.functions.ts`. Routes: TanStack Router
  file-based conventions (`$param` for dynamic segments, `index.tsx` for a directory's root).
- Styling: Tailwind utility classes against the custom tokens in `styles.css` (`bg-field`,
  `text-parchment`, `text-mustard-bright`, `font-display`, etc.) — no ad hoc hex colors.
- Zod schemas validate all server function inputs via `.inputValidator(...)`.

## Environment Variables

- `ADMIN_PASSWORD` — password required to access `/admin`. Falls back to a dev-only default if unset.
- `SESSION_SECRET` — encryption key for the admin session cookie. Falls back to a dev-only default if unset.

Set both in the Netlify site's environment variables before relying on the admin dashboard in production.
