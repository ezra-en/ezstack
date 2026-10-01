# Deployment

ezstack links no deployment. Pick a target per project:

| Target             | Frontend                           | Convex                          | Guide                            |
| ------------------ | ---------------------------------- | ------------------------------- | -------------------------------- |
| Cloudflare Workers | vinext + `@cloudflare/vite-plugin` | Convex Cloud **or** self-hosted | [cloudflare.md](./cloudflare.md) |
| Full Coolify       | Node image (`Dockerfile`)          | self-hosted (compose)           | [coolify.md](./coolify.md)       |

Local development needs none of this — see the README quick start
(`CONVEX_AGENT_MODE=anonymous bunx convex dev`).

## Environment, in two places

**Build-time / frontend** (`.env.local` locally, build args or platform vars in
production):

| Variable                      | Notes                   |
| ----------------------------- | ----------------------- |
| `NEXT_PUBLIC_CONVEX_URL`      | Convex API URL          |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Convex HTTP-actions URL |
| `NEXT_PUBLIC_SITE_URL`        | Public frontend URL     |

**Runtime / Convex deployment** (never in `.env.local`; see
`.env.convex.example`). Declared and validated in `convex/convex.config.ts`, so
a missing or malformed value fails the push:

| Variable             | Required | Notes                                            |
| -------------------- | -------- | ------------------------------------------------ |
| `SITE_URL`           | yes      | Better Auth `baseURL`, callbacks, trusted origin |
| `BETTER_AUTH_SECRET` | yes      | `openssl rand -base64 32`                        |
| `CORS_ORIGINS`       | no       | Extra browser origins, comma-separated           |

Push runtime vars and functions together with
[`scripts/deploy-convex.sh`](../../scripts/deploy-convex.sh):

```sh
# .env.production            -> deployment target (self-hosted URL + admin key, or deploy key)
# .env.convex.production     -> SITE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS, …
bash scripts/deploy-convex.sh production
```

Always deploy the frontend from the **same commit** as the backend.

## Hiding the Convex URLs

Two different problems:

1. **Self-hosted → branded origins (recommended).** Set `CONVEX_CLOUD_ORIGIN`
   and `CONVEX_SITE_ORIGIN` to your own subdomains and point
   `NEXT_PUBLIC_CONVEX_URL` / `NEXT_PUBLIC_CONVEX_SITE_URL` at them. No proxy.
2. **Convex Cloud → proxy required.** `*.convex.cloud` / `*.convex.site` cannot
   be renamed. `next.config.ts` rewrites (which vinext honors) can front the
   HTTP API, but **not** the realtime WebSocket (`/api/<version>/sync`). Use a
   WebSocket-capable layer in production (e.g. Caddy/nginx), or Vite
   `server.proxy` in dev.
