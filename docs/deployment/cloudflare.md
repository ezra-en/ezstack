# Deploying to Cloudflare Workers

vinext's native target. Bindings are accessed with
`import { env } from "cloudflare:workers"` — no custom worker entry needed.

## 1. Add the Cloudflare pieces

```sh
bun add @cloudflare/vite-plugin @vinext/cloudflare
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  server: { port: 3000 },
  preview: { port: 3000 },
  plugins: [
    vinext(),
    // Do NOT add an explicit @vitejs/plugin-rsc call; vinext registers it, and
    // a duplicate fails the build.
    cloudflare({ viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] } }),
  ],
});
```

```jsonc
// wrangler.jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "ezstack",
  "compatibility_date": "2026-09-29",
  "compatibility_flags": ["nodejs_compat"],
  "main": "vinext/server/app-router-entry",
  "assets": { "not_found_handling": "none" },
}
```

Add bindings (D1, R2, KV, AI, …) here; `bunx wrangler types` generates types.

## 2. Choose where Convex runs

**Managed (Convex Cloud).** Create the production deployment and set its vars:

```sh
bunx convex deploy
bunx convex env set --prod SITE_URL https://app.example.com
bunx convex env set --prod BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
bunx convex env set --prod CORS_ORIGINS https://app.example.com
```

Then build with the production URLs:

```
NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://<deployment>.convex.site
NEXT_PUBLIC_SITE_URL=https://app.example.com
```

**Self-hosted.** Run the backend ([coolify.md](./coolify.md) or any host), set
`CONVEX_CLOUD_ORIGIN` / `CONVEX_SITE_ORIGIN` to branded domains, and point the
`NEXT_PUBLIC_*` URLs at them. This hides the raw backend URLs without a proxy.

## 3. Build and deploy

```sh
npx @vinext/cloudflare deploy        # builds and deploys via wrangler
npx @vinext/cloudflare deploy --preview
```

`NEXT_PUBLIC_*` values are embedded at build time, so pass them as build
environment variables (e.g. in CI) before deploying.

## Cost note

Cloudflare's free tier is generous, but a popular app can exceed it; cost is
harder to predict than a fixed VPS. Keep an eye on Workers/requests and any
paid bindings.
