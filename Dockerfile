# Frontend image for the Node target (Coolify, VPS, etc.).
#
# Dependencies install with Bun; the build runs on Node because vinext's App
# Router scanner needs fs.promises.glob, which Bun does not implement
# compatibly. NEXT_PUBLIC_* values are embedded at BUILD time.
#
#   docker build \
#     --build-arg NEXT_PUBLIC_CONVEX_URL=https://convex-api.example.com \
#     --build-arg NEXT_PUBLIC_CONVEX_SITE_URL=https://convex-site.example.com \
#     --build-arg NEXT_PUBLIC_SITE_URL=https://app.example.com \
#     -t ezstack .
#
# This is a starting point — adjust the copied files if your app needs public/
# or other runtime assets.

FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --no-save

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_CONVEX_URL
ARG NEXT_PUBLIC_CONVEX_SITE_URL
ARG NEXT_PUBLIC_SITE_URL
RUN node ./node_modules/vinext/dist/cli.js build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/next.config.ts ./next.config.ts
COPY --from=builder --chown=node:node /app/vite.config.ts ./vite.config.ts
USER node
EXPOSE 3000
CMD ["node", "./node_modules/vinext/dist/cli.js", "start"]
