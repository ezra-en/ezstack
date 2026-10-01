#!/usr/bin/env bash
#
# Deploy Convex functions and environment variables to a named environment.
#
#   bash scripts/deploy-convex.sh production
#
# Requires, in the repo root:
#   .env.<env>          Deployment target for the Convex CLI:
#                         self-hosted: CONVEX_SELF_HOSTED_URL + CONVEX_SELF_HOSTED_ADMIN_KEY
#                         Convex Cloud: CONVEX_DEPLOY_KEY
#   .env.convex.<env>   KEY=VALUE pairs pushed into the deployment
#                       (BETTER_AUTH_SECRET, SITE_URL, CORS_ORIGINS, …)
#
# Deploy the frontend from the SAME commit, or the frontend may call functions
# the backend does not have yet.
set -euo pipefail

ENV="${1:-}"
if [ -z "$ENV" ]; then
  echo "Usage: $0 <env>   (e.g. staging | production)" >&2
  exit 2
fi

cd "$(dirname "$0")/.."

ENV_FILE=".env.$ENV"
CONVEX_ENV_FILE=".env.convex.$ENV"

for f in "$ENV_FILE" "$CONVEX_ENV_FILE"; do
  if [ ! -f "$f" ]; then
    echo "ERROR: missing $f — cannot deploy to '$ENV'." >&2
    exit 1
  fi
done

# Guard: NEXT_PUBLIC_CONVEX_URL must be a URL, not a pasted API key.
url_line="$(grep -E '^[[:space:]]*NEXT_PUBLIC_CONVEX_URL=' "$ENV_FILE" | tail -1 || true)"
if [ -n "$url_line" ]; then
  url="${url_line#*=}"
  case "$url" in
    http://*|https://*) ;;
    *)
      echo "ERROR: NEXT_PUBLIC_CONVEX_URL in $ENV_FILE is not a URL." >&2
      echo "       It should be the Convex URL, not an API key." >&2
      exit 1
      ;;
  esac
fi

if ! grep -qE '^BETTER_AUTH_SECRET=.+' "$CONVEX_ENV_FILE"; then
  echo "WARNING: BETTER_AUTH_SECRET is empty in $CONVEX_ENV_FILE." >&2
fi

# Load the target deployment into the environment. `convex env set` selects the
# deployment from env vars (.env files are not loaded automatically), while
# `convex deploy` can also take --env-file. A shell CONVEX_DEPLOYMENT would
# override everything, so clear it.
# shellcheck disable=SC1090
set -a; . "$ENV_FILE"; set +a
unset CONVEX_DEPLOYMENT || true

echo ">> Pushing deployment env from $CONVEX_ENV_FILE ..."
bunx convex env set --from-file "$CONVEX_ENV_FILE" --force

echo ">> Deploying Convex functions to '$ENV' ..."
bunx convex deploy --yes --env-file "$ENV_FILE"

echo ">> Done. Convex backend deployed to '$ENV'."
echo ">> Now build/redeploy the frontend from the SAME commit."
