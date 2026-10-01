# Deploying with Coolify (self-hosted, full stack)

Assumes **everything lives in Coolify**: the frontend as an application and
Convex as a compose service. Give the Convex backend dedicated headroom —
roughly **2× the frontend's** CPU/RAM; it is the database and does the heavy
lifting.

## 1. Convex backend (compose service)

`deploy/convex.compose.yaml` runs the self-hosted backend. In Coolify, create a
Compose service from it and set:

```env
CONVEX_CLOUD_ORIGIN=https://convex-api.example.com   # API, maps to :3210
CONVEX_SITE_ORIGIN=https://convex-site.example.com   # HTTP actions, maps to :3211
```

Point both domains at the service and include the upstream port in Coolify's
domain field (`:3210` / `:3211`); public clients use plain HTTPS.

Once healthy, open the backend terminal and run:

```sh
./generate_admin_key.sh
```

Save the key in a gitignored `.env.production`:

```dotenv
CONVEX_SELF_HOSTED_URL=https://convex-api.example.com
CONVEX_SELF_HOSTED_ADMIN_KEY=<instance admin key>
```

Generate a fresh auth secret into a gitignored `.env.convex.production` (see
`.env.convex.example`):

```dotenv
BETTER_AUTH_SECRET=<openssl rand -base64 32>
SITE_URL=https://app.example.com
CORS_ORIGINS=https://app.example.com
```

## 2. Deploy the backend functions

```sh
bash scripts/deploy-convex.sh production
```

This pushes the deployment env and the functions. Re-run it whenever backend
code or runtime config changes.

## 3. Frontend application

Create an application in Coolify from the same repository and point it at the
root `Dockerfile`. Set the `NEXT_PUBLIC_*` values as **build arguments** (they
are embedded at build time):

```
NEXT_PUBLIC_CONVEX_URL=https://convex-api.example.com
NEXT_PUBLIC_CONVEX_SITE_URL=https://convex-site.example.com
NEXT_PUBLIC_SITE_URL=https://app.example.com
```

Then deploy. Because `NEXT_PUBLIC_*` are baked in, a rebuild is required after
changing them (a restart is not enough).

## 4. First admin

No default credentials exist. After the backend is deployed:

```sh
bunx convex run init:bootstrapAdmin \
  '{"email":"you@example.com","password":"pick-something-strong","name":"You"}'
```

or run `init:bootstrapAdmin` from the Convex dashboard (Functions tab).

## 5. Give an agent access (optional)

Agents can drive Coolify with the CLI + an API token rather than the UI:

```sh
coolify context add production https://coolify.example.com <api-token>
coolify deploy name <frontend-app>
```

## 6. Verify

- `curl -i -X OPTIONS https://convex-site.example.com/api/auth/sign-in/email \
   -H "Origin: https://app.example.com" -H "Access-Control-Request-Method: POST"`
  returns `access-control-allow-origin: https://app.example.com`.
- Sign-in works from the app domain; the first admin can reach the dashboard.
- Frontend and backend were deployed from the same commit.
