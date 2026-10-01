# ezstack

A full-stack starter built on **Convex** (realtime backend) and **Better Auth**,
running on **vinext** (the Next.js API surface reimplemented on Vite).

- **vinext** — App Router, React Server Components, Vite HMR and build
- **Convex** — realtime database, typed functions, file storage
- **Better Auth** (Local Install) — email/password + admin RBAC, no defaults
- **Tailwind CSS v4**, **Biome 2**, **TypeScript 7**, **Vitest**

## Quick start

No Convex account is required for local development — the CLI can run an
anonymous local backend.

```sh
bun install

# Creates a local Convex backend and writes .env.local
CONVEX_AGENT_MODE=anonymous bunx convex dev
```

In another terminal, set the deployment environment (required before the first
push; `convex dev` will tell you if these are missing):

```sh
bunx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
bunx convex env set SITE_URL http://localhost:3000
```

Then start the app:

```sh
bun run dev          # vinext dev server on http://localhost:3000
```

Create the first admin (no default credentials exist anywhere):

```sh
bunx convex run init:bootstrapAdmin \
  '{"email":"you@example.com","password":"pick-something-strong","name":"You"}'
```

Prefer a graphical setup? Run `bunx convex dev` without the agent-mode env var
and choose **"Start without an account"**, or log in later with
`bunx convex login` to link a cloud project.

## Scripts

| Script | What it does |
| --- | --- |
| `bun run dev` | vinext dev server (Vite) on port 3000 |
| `bun run dev:portless` | Same, behind [portless](https://github.com/vercel/portless) for a stable local URL |
| `bun run build` | Production build (`vite build`) |
| `bun run start` | Serve the production build (`vinext start`) |
| `bun run typecheck` | `tsc --noEmit` (TypeScript 7) |
| `bun run lint` / `format` | Biome check / format |
| `bun run test` | Vitest |
| `bun run convex:dev` | Convex dev deployment |
| `bun run betterAuth:generate` | Regenerate `convex/betterAuth/generatedSchema.ts` |

> `typecheck` and `build` need `convex/_generated`, which is **not committed**.
> Run `bunx convex dev` once first.

## Environment

Two separate places, deliberately:

**`.env.local`** (frontend, gitignored — copy `.env.example`):
`CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`,
`NEXT_PUBLIC_SITE_URL`.

**The Convex deployment** (never in `.env.local` — see `.env.convex.example`).
Set with `bunx convex env set` or the dashboard:

| Variable | Required | Notes |
| --- | --- | --- |
| `SITE_URL` | yes | Better Auth `baseURL`; drives callbacks |
| `BETTER_AUTH_SECRET` | yes | `openssl rand -base64 32` |
| `CORS_ORIGINS` | no | Comma-separated extra browser origins |

These are declared in `convex/convex.config.ts` and validated **at push time**,
so a typo or missing value fails the deploy instead of the runtime.

## Auth

The Better Auth component is installed locally (`convex/betterAuth/`) so plugins
that need schema changes — like `admin` — work:

```
convex/auth.ts               createClient + createAuthOptions + createAuth
convex/auth.config.ts        getAuthConfigProvider()
convex/betterAuth/auth.ts    static `auth` export for schema generation only
convex/betterAuth/schema.ts  generated tables (+ custom indexes)
convex/betterAuth/adapter.ts createApi(schema, createAuthOptions)
convex/betterAuth/users.ts   component-side queries (e.g. countAdmins)
convex/http.ts               authComponent.registerRoutes(...)
convex/init.ts               bootstrapAdmin (internal, no defaults)
convex/permissions.ts        access-control roles
lib/auth-client.ts           client
lib/auth-server.ts           convexBetterAuthNextJs helpers
app/api/auth/[...all]/route.ts
app/ConvexClientProvider.tsx
```

After changing auth options that affect the schema:

```sh
bun run betterAuth:generate
```

### Roles

`user` (default), `admin`, `superadmin` — defined in `convex/permissions.ts` and
wired into the Better Auth admin plugin.

### Multiple origins

`CORS_ORIGINS` (comma-separated) is shared by the Convex HTTP CORS config and
Better Auth `trustedOrigins`, on top of `SITE_URL` and localhost. Useful for
client-owned domains or a migration window.

## Dev tooling

- **portless** (optional) gives stable local URLs instead of ports. Install it
  (`bun add -g portless`), keep `portless.json`, and run `bun run dev:portless`.
- **Biome** replaces ESLint/Prettier: `bun run lint` / `bun run format`.
- **Vitest** for unit tests; pure helpers live outside `convex/` (e.g.
  `convex/lib/`) so they can be imported directly.

## Deployment

Two supported paths, documented in [docs/deployment](./docs/deployment/README.md):

1. **[Cloudflare Workers + Convex](./docs/deployment/cloudflare.md)** — add
   `@cloudflare/vite-plugin` + `@vinext/cloudflare`, build and deploy to
   Workers. Convex runs managed or self-hosted. Watch free-tier limits.
2. **[Full Coolify](./docs/deployment/coolify.md)** — frontend `Dockerfile`
   plus a self-hosted Convex compose service. Give the backend ≈2× the
   frontend's resources; drive Coolify from the CLI + API tokens.

Runtime env and functions deploy together with
`bash scripts/deploy-convex.sh <env>`. Always deploy the frontend from the
**same commit** as the backend.

`next.config.ts` is honored by vinext for `rewrites`, `headers`, `redirects`
and `images`. To hide Convex URLs, prefer branded origins for a self-hosted
backend; on Convex Cloud the realtime WebSocket needs a WS-capable proxy, which
rewrites do not provide.

## Project structure

```
app/                 routes, layout, Convex provider, auth route handler
convex/              backend functions, auth, schema, config
convex/betterAuth/   local Better Auth component
convex/lib/          pure, unit-tested helpers
lib/                 auth client + server helpers
test/                Vitest unit tests
next.config.ts       read by vinext (rewrites/headers/images)
vite.config.ts       vinext + Vite config
```
