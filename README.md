# League of Bums

The official site for the League of Bums fantasy football league: season hub, ManeyCast podcast,
league history, awards, and team/manager profiles.

## Pages

- **Home** (`/`) — league branding and links into every section.
- **Season** (`/season`) — power rankings, head-to-head matchups, and weekly previews for the
  current season.
- **ManeyCast** (`/podcast`) — podcast episodes embedded straight from Google Drive links.
- **History** (`/history`) — past champions, every trade ever recorded, and team-by-team season
  histories.
- **Awards** (`/awards`) — league awards grouped by season.
- **Teams** (`/teams`, `/teams/:teamSlug`) — team and manager profiles.
- **Admin** (`/admin`) — password-protected dashboard for adding/removing all of the above.

## Tech Stack

TanStack Start (React 19 + TanStack Router + Vite 7), Tailwind CSS 4, Drizzle ORM against Netlify
Database (Postgres), deployed on Netlify. See `AGENTS.md` for the full architecture breakdown.

## Local Development

```bash
pnpm install
pnpm dev
```

The dev server runs through Netlify Dev, which provisions a local connection to Netlify Database
automatically.

## Admin Access

Content (teams, rankings, matchups, previews, podcast episodes, trades, champions, awards, team
history) is managed at `/admin`, gated by a single shared password.

Set these environment variables in your Netlify site configuration before going live:

- `ADMIN_PASSWORD` — the password required to log into `/admin`.
- `SESSION_SECRET` — a random secret used to encrypt the admin session cookie.

Without them, the app falls back to insecure development-only defaults — do not rely on those in
production.

## Database

Schema lives in `db/schema.ts`. Migrations live in `netlify/database/migrations/` and are applied
automatically by Netlify at deploy time — never run them manually. To change the schema, edit
`db/schema.ts` and run:

```bash
npx drizzle-kit generate --name <description>
```

The initial deploy ships with placeholder demo data (ten fictional teams, sample rankings,
matchups, a couple of trades, past champions, and awards) so the site isn't empty on first load.
Replace it with real league data through the admin dashboard.
