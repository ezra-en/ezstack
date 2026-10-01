# AGENTS.md

## What this is

`ezstack` — Convex + Better Auth running on **vinext** (the Next.js API surface
on Vite). App Router, React Server Components, Tailwind v4, Biome, TypeScript 7,
Vitest.

## Commands

| Task | Command |
| --- | --- |
| Dev server | `bun run dev` (Vite, port 3000) |
| Convex backend | `bun run convex:dev` — or `CONVEX_AGENT_MODE=anonymous bunx convex dev` for a local, no-account backend |
| Build / start | `bun run build` / `bun run start` |
| Typecheck | `bun run typecheck` (`tsc --noEmit`, TS 7) |
| Lint / format | `bun run lint` / `bun run format` (Biome) |
| Tests | `bun run test` (Vitest) |
| Regenerate auth schema | `bun run betterAuth:generate` |

`typecheck` and `build` need `convex/_generated`, which is **not committed**.
Run `bunx convex dev` once to generate it.

## Conventions

- TypeScript strict. Formatting/linting is Biome — do not add ESLint or Prettier.
- Convex: use the new function syntax and always add argument/return validators.
  Keep pure helpers in `convex/lib/` (no Convex imports at module scope) so they
  stay unit-testable; tests live in `test/`.
- Secrets never go in the repo. Frontend config goes in `.env.local`; runtime
  config goes on the Convex deployment and is declared/validated in
  `convex/convex.config.ts`.
- `convex/_generated` and `convex/betterAuth/_generated` are generated and
  gitignored.

## vinext notes

- `vinext` reimplements the Next.js API on Vite. `dev`/`build` are thin proxies
  to the project-local Vite CLI, so prefer `vite dev` / `vite build`.
- Do **not** rewrite `next/*` imports — vinext shims them.
- `next.config.ts` **is** read by vinext (`rewrites`, `headers`, `redirects`,
  `images`, `env`). Do not add webpack/turbopack config; use Vite plugins.
- `server.port` is pinned to 3000 in `vite.config.ts` to match `SITE_URL`.

## Auth

- Better Auth uses **Local Install**: component under `convex/betterAuth/`.
  `createAuthOptions` lives in `convex/auth.ts` because code in the component
  directory must not read environment variables.
- After changing auth options that affect the schema, run
  `bun run betterAuth:generate`.
- Admin bootstrap is the internal `init:bootstrapAdmin` mutation — explicit
  credentials only, no defaults; refuses once an admin exists.
- Roles are defined in `convex/permissions.ts`.
- CORS and Better Auth `trustedOrigins` share `getAllowedOrigins()` in
  `convex/lib/origins.ts` (`SITE_URL` + `CORS_ORIGINS` + localhost).

## Reference

- `PLANS/ezstack-modernization.md` — the working modernization plan.
- `README.md` — setup, environment, and deployment.
