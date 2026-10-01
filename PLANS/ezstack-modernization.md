# ezstack modernization plan — fresh scaffold (v3)

**Status:** in progress — Phases A–C done and verified; Phase E (docs/CI) done; Phase D (deployment docs) pending.
**Branch:** local `v2` (not yet pushed)
**Author:** working session, 2026-09-29
**Repo:** `~/projects/ezraen/ezstack` @ `main` (`53aa088`)

A working doc, not template content. Move or drop before the template is finalized.

---

## 1. Context

`ezstack` is the personal full-stack starter (Convex + Tailwind v4 + shadcn + Better Auth).
It was last meaningfully updated in **April 2026**. Two things have changed since:

1. **Runtime moved from Next.js to vinext**, mainly for much lower build-time cost. Two
   working patterns already exist in the workspace:
   - `DH/nh4-svg-interactive` — Node standalone (`dist/standalone/server.js`), Docker/Coolify.
   - `ezraen/reveal-vinext` — Cloudflare Workers (`@vinext/cloudflare` + wrangler).
2. Hard-won `nh4` learnings belong upstream: multi-origin CORS, multi-env deploy scripts,
   Better Auth / JWT hardening, RBAC, and a no-defaults admin bootstrap.

### Decisions locked in this session

| Decision | Choice |
| --- | --- |
| Approach | **Rebuild fresh from current docs** on a **`v3` branch** in the same repo, then re-apply learnings. |
| Auth plugins | Email/password + **admin** (used across nh4/onemap/pahang/ezstack). **Organization not shipped** — never used; documented as a local-install extension. |
| Deployment docs | Two paths only: **CF Pages + Convex**, and **full Coolify** (frontend + self-hosted Convex). Repo links **no** deployment. |
| Local dev | **Local anonymous deployment only** — no cloud account required to run or test. |
| Admin bootstrap | **`internalMutation`, explicit args, no defaults**, run from Convex dashboard or CLI. |
| Env tooling | **Drop varlock.** Convex typed env + a small frontend validator + committed examples. |
| Typecheck | **Retire `tsgo`; use TypeScript 7 native `tsc`.** |
| Branches | `v2` + `feat/better-auth` dead; `claude/upgrade-better-auth` is superseded by the fresh scaffold. |

---

## 2. Why a fresh scaffold (not an in-place upgrade)

The official setup has moved enough that upgrading ezstack is more work than rebuilding it
against the docs, and we'd drag along a half-migrated shape. Concretely, ezstack currently:

- keeps the auth instance in `convex/auth.ts` with a `getStaticAuth` + `optionsOnly` hack;
- uses `nextJsHandler()` in the route file and a bare `ConvexClientProvider` (no SSR token);
- uses the legacy `domain:` provider in `auth.config.ts`;
- generates schema with the old `@better-auth/cli` (`better-auth:generate` script);
- has no local-install split, tests, CI, or multi-env deploy.

The current docs produce a different, cleaner shape (§3). A fresh scaffold also lets us bake
in the learnings from day one instead of retrofitting.

---

## 3. What the current official docs produce

Sources: `docs.convex.dev/quickstart/nextjs`, `better-auth.com/docs/integrations/convex`,
`labs.convex.dev/better-auth/*` (Getting Started, framework-guides/next, features/local-install,
supported-plugins, migrations/migrate-to-0-12).

> **Doc-split caveat:** the *integration* page and the *local-install* page disagree on where
> `createAuthOptions` lives. The local-install page wins for us (we need local install, §4):
> the component directory must not read env vars, so `createAuthOptions` lives in
> `convex/auth.ts` and `convex/betterAuth/auth.ts` only exports a static `auth` for the CLI.

Canonical files (local-install variant):

| File | Purpose |
| --- | --- |
| `convex/convex.config.ts` | `defineApp()` + `app.use(betterAuth from ./betterAuth/convex.config)` + typed `env` declarations. |
| `convex/betterAuth/convex.config.ts` | `defineComponent("betterAuth")` — marks the dir as a local component. |
| `convex/betterAuth/auth.ts` | **Only** `export const auth = createAuth({} as any)` for schema generation. |
| `convex/betterAuth/schema.ts` | Generated: `cd convex/betterAuth && npx auth generate`. |
| `convex/betterAuth/adapter.ts` | `createApi(schema, createAuthOptions)` exported as `create/findOne/…`. |
| `convex/auth.ts` | `createClient<DataModel, typeof schema>(components.betterAuth, { local: { schema } })`, `createAuthOptions`, `createAuth`. |
| `convex/auth.config.ts` | `providers: [getAuthConfigProvider()]`. |
| `convex/http.ts` | `httpRouter()` + `authComponent.registerRoutes(http, createAuth)`. |
| `lib/auth-client.ts` | `createAuthClient({ plugins: [convexClient()] })`. |
| `lib/auth-server.ts` | `convexBetterAuthNextJs({ convexUrl, convexSiteUrl })` → `handler`, `getToken`, `preloadAuthQuery`, `fetchAuthQuery`, … |
| `app/api/auth/[...all]/route.ts` | `export const { GET, POST } = handler`. |
| `components/ConvexClientProvider.tsx` | `ConvexBetterAuthProvider` with `initialToken`. |
| `app/layout.tsx` | `async`, `const token = await getToken()`, pass to provider. |

Environment (per docs):
- **On the Convex deployment** (CLI/dashboard, never `.env.local`): `BETTER_AUTH_SECRET`
  (`openssl rand -base64 32`), `SITE_URL` (drives `baseURL`).
- **In `.env.local`**: `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`,
  `NEXT_PUBLIC_CONVEX_SITE_URL`, `NEXT_PUBLIC_SITE_URL`.

---

## 4. Plugins: "supported" vs Local Install

Per `labs.convex.dev/better-auth/supported-plugins`, the out-of-the-box plugins are:
Anonymous, Email OTP, Generic OAuth, JWT, Magic Link, One Tap, Phone Number, Two Factor,
Username. **SSO is incompatible** (Node dependencies).

**Admin and Organization are not on that list.** They require **Local Install**, which is the
documented path for "plugins that require schema changes" (confirmed by the maintainer in
get-convex/better-auth#350, now closed). Local Install also unlocks custom indexes and Convex
functions that read the auth component's tables directly. The template ships the **Local
Install** layout from the start.

**Organization usage audit (2026-09-29):** no repo in the workspace uses it. Grepping for
`organizationClient`, `useActiveOrganization`, `better-auth/plugins/organization`, and
`organization({…})` across `~/projects` returns only unrelated `setActive` tab-state and an
unrelated `organization` string field. The sole trace is a dead `feat/better-auth` commit
("add organization and member models"). By contrast `admin` is used in nh4, onemap, pahang,
and ezstack itself.

**Decision:** ship email/password + `admin`; leave `organization` out and document it as a
Local Install extension (tables + `organizationClient()` + `useActiveOrganization`).

---

## 5. Version targets (corrected)

| Package | In ezstack | Target |
| --- | --- | --- |
| `vinext` | — | `1.0.0` (stable) |
| `vite` | — | `8.3.x` |
| `convex` | `^1.29.1` | `1.46.0` |
| `@convex-dev/better-auth` | `^0.9.7` | `0.12.5` |
| `better-auth` | 1.4.5 | **`~1.6.15` — not 1.7.x.** 0.12.x supports the 1.6 line only (min 1.6.11). |
| `react` / `react-dom` | 19.2.0 | `19.3.0` |
| `tailwindcss` | `^4` | `4.3.3` |
| `@biomejs/biome` | 1.8.3 schema | `2.5.14` |
| `typescript` | `^5` | `7.0.2` (native `tsc`) |
| `vitest` | — | `5.0.2` |
| `next` | 16.0.10 | *(dropped in favour of vinext)* |

Schema-generation CLI changed name: `npx @better-auth/cli generate` → **`npx auth generate`**
(from `convex/betterAuth`).

---

## 6. TypeScript 7 vs `tsgo` (spike result)

**Same compiler, different life stage — not the same package.**

- `typescript@7.0.2` → `bin/tsc`, ELF-native, backed by `@typescript/typescript-linux-x64/lib/tsc`.
- `@typescript/native-preview@7.0.0-dev.20260707.2` → `tsgo`, its own native binary.
- Identical diagnostics; 4000-line file: `tsc` 362 ms vs `tsgo` 388 ms (best of 3).
- `tsgo` was the preview name; TypeScript 7.0 GA (2026-07-08) renamed it `tsc` in the
  mainline `typescript` package. Nightlies moved to `typescript@next`.

**Consequence:** the workspace rule *"NEVER run `tsc`, ALWAYS use `tsgo`"* is inverted under
TS7. Adopt `typescript@7` + `tsc --noEmit`, remove `@typescript/native-preview`, update
`~/projects/AGENTS.md`.

> Caveat: TS7 removes options deprecated in TS6; audit `tsconfig.json`.

---

## 7. Env strategy (dropping varlock)

varlock is maintained (1.21.1, 2026-09-29) with an Infisical plugin, but it's a CLI wrapper
that interposes on external tools — the surface that broke with Infisical + mise. No `mise`
issues exist in its tracker. Convex ≥ 1.39 covers the backend natively:

- declare expected vars in `defineApp({ env: … })`, read via typed `env` from
  `_generated/server`, validated at push time;
- push with `npx convex env set --from-file .env.convex.<env> --force`.

Replacement:
- **Backend:** Convex typed env + `env` reader.
- **Frontend:** `lib/env.ts` (zod) parses `process.env` once and fails fast.
- **Docs:** committed `.env.example` + `.env.convex.example`, in sync with declarations.
- No wrapper CLI in the hot path; varlock can be layered on later if a secrets manager is added.

---

## 8. Admin bootstrap (no defaults)

```ts
// convex/init.ts
export const bootstrapAdmin = internalMutation({
  args: { email: v.string(), password: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    // refuse if any admin exists (one-shot); then auth.api.createUser({ body: { ...args, role: "admin" } })
  },
});
```

- `internalMutation` → not client-callable; runnable from the **dashboard** and
  `npx convex run init:bootstrapAdmin '{…}'`.
- No default credentials anywhere.
- Do **not** port nh4's `scripts/seed-admin.ts` (it regex-rewrites `auth.ts` to append
  `adminUserIds`). Roles set at creation + `adminRoles` make the allowlist redundant.
- Optional: `scripts/bootstrap-admin.sh <env>` sources `.env.<env>` and **prompts** for the
  password rather than storing it.

---

## 9. Hiding the cloud / site URLs

The `nh4` approach is: **give the self-hosted backend its own branded origins** and point the
client at them.

- Self-hosted: set `CONVEX_CLOUD_ORIGIN=https://<app>-api.example.com` and
  `CONVEX_SITE_ORIGIN=https://<app>-site.example.com`, then
  `NEXT_PUBLIC_CONVEX_URL` / `NEXT_PUBLIC_CONVEX_SITE_URL` to those. (nh4 does exactly this:
  `nh4-pre-prod-api.dh.sg` / `nh4-pre-prod-site.dh.sg`.)
- Convex Cloud: `*.convex.cloud` / `*.convex.site` cannot be renamed, so hiding needs a proxy.

**WebSocket caveat:** the Convex real-time sync is a WebSocket at `/api/<version>/sync`.
Next.js `rewrites()` do **not** forward the HTTP `Upgrade` header, so a pure rewrite breaks live
queries. Options: a custom `server.js` handling the `upgrade` event, or a real reverse proxy
(Caddy/nginx/Traefik) fronting both origins. The supplementary `next.config.ts` rewrites
(`/api/:version/*`, `/convex-http/*`) are useful for same-origin HTTP action calls but are not
a substitute for WS-capable proxying.

---

## 10. Execution plan

### Phase A — Scaffold from current docs
1. `bunx create-convex@latest` (auth: **none**) or `bunx create-next-app@latest` + Convex;
   keep app-router layout.
2. Install `better-auth@~1.6.15`, `@convex-dev/better-auth@^0.12.5`, `convex@^1.46`.
3. `convex/auth.config.ts` → `getAuthConfigProvider()`.
4. Local Install layout (§3): `convex/betterAuth/{convex.config,auth,schema,adapter}.ts`,
   `createAuthOptions` in `convex/auth.ts`, `convex/http.ts` routes.
5. Client/server: `lib/auth-client.ts`, `lib/auth-server.ts`, route handler,
   `ConvexClientProvider` with `initialToken`, async `layout.tsx`.
6. `cd convex/betterAuth && npx auth generate`; verify `convex dev` pushes clean.
7. Add `admin` (and optionally `organization`) plugin; regenerate schema.

### Phase B — vinext
1. Add `vinext@1.0.0`, `vite@8`, `@vitejs/plugin-react`, `@vitejs/plugin-rsc`,
   `react-server-dom-webpack`.
2. `vite.config.ts` (bare `plugins: [vinext()]`).
3. Scripts: `dev: vinext dev`, `build: vinext build`, `start: node dist/standalone/server.js`.
4. Keep `next.config.ts` for `rewrites`/`headers`/`redirects`/`images` — **audit** vinext parity.
5. Verify client env handling (`process.env.NEXT_PUBLIC_*` vs `import.meta.env`).
6. Node/Docker: adapt Dockerfile (Bun install, **Node build** — vinext needs
   `fs.promises.glob`; serve `dist/standalone/server.js`) + compose for self-hosted Convex.
7. Cloudflare: `@vinext/cloudflare` + `wrangler.jsonc` + KV cache; secrets via `wrangler secret`.

### Phase C — Learnings
1. Multi-origin CORS: `getExtraOrigins()` from `CORS_ORIGINS`, shared by the Convex HTTP
   `cors()` and Better Auth `trustedOrigins`, seeded with the deployment URL + localhost.
2. RBAC (`convex/permissions.ts`) + `bootstrapAdmin` (§8).
3. JWT hardening: `customJwt` provider against the public JWKS URL,
   `jwksRotateOnTokenGenerationError`, `fixJwks:clearAllJwks`, `/api/health` diagnostics,
   `TROUBLESHOOTING_JWT.md`.
4. Branded origins / proxy per §9.

### Phase D — Deployment docs (no linked deployment)

Two supported paths, both documented; the repo links nothing.

1. **Cloudflare Pages + Convex**
   - Frontend: `@vinext/cloudflare` build → CF Pages (`wrangler.jsonc`, KV data cache).
   - Convex: managed Convex Cloud **or** self-hosted; for self-hosted set
     `CONVEX_CLOUD_ORIGIN` / `CONVEX_SITE_ORIGIN` to branded origins.
   - Caveat: CF free tiers are generous, but cost is unpredictable if usage grows.
2. **Full Coolify (frontend + self-hosted Convex)**
   - Assume everything lives in Coolify: frontend app + Convex backend service.
   - Ship **2× resource** guidance (dedicated CPU/RAM headroom for the backend) and the
     Docker Compose configs.
   - Recommend granting an agent access via the Coolify CLI + API tokens.
3. Env files (`.env.<env>` target vs `.env.convex.<env>` deployment vars) + committed
   examples + `scripts/deploy-convex.sh <env>` (native `convex env set --from-file … --force`
   + `convex deploy --env-file`, plus a URL-vs-API-key guard). Default docs target a single
   self-host rather than assuming many named envs.
4. Local dev uses a **local anonymous deployment** — no cloud account required.

### Phase E — Docs, tooling, hygiene
1. Biome 2.5 (+ remove ESLint), `typescript@7`, vitest, `tsc --noEmit`.
2. Rewrite `README.md` and `AGENTS.md`; update `~/projects/AGENTS.md` for TS7.
3. Add CI (typecheck + biome + vitest).
4. Close dependabot #16/#15; delete `v2` / `feat/better-auth`; archive `claude/upgrade-better-auth`.

---

## 11. Open questions

- **vinext `next.config.ts` parity** — audit `rewrites`/`headers`/`redirects`/`images` before
  relying on them.
- **Cloudflare + Convex websockets / cross-domain auth cookies** — the Node/Docker path is
  proven in nh4; Workers is not.
- **Local anonymous deployment mechanics** — confirm the exact CLI flow for a no-account local
  Convex backend (self-hosted docker vs the CLI's `local` deployment reference).

---

## 12. Verification gates

Each phase ends green:

- `tsc --noEmit` (TypeScript 7)
- `biome check`
- `vitest run`
- Manual: sign-in/out, multi-origin CORS preflight, `bootstrapAdmin` from dashboard + CLI,
  build on both targets (Node standalone, Cloudflare).
