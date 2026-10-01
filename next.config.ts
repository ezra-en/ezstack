// vinext reads this file for redirects, rewrites, headers, basePath, i18n,
// images and env config — the same options Next.js supports.
//
// Hiding the Convex URLs: prefer branded origins for a self-hosted backend
// (set CONVEX_CLOUD_ORIGIN / CONVEX_SITE_ORIGIN and point the NEXT_PUBLIC_*
// URLs at them). On Convex Cloud the hostnames can't be renamed, and the
// realtime sync is a WebSocket that rewrites do NOT proxy, so front the HTTP
// API here only if you also put a WebSocket-capable proxy in front.
//
// Example (HTTP API + HTTP actions only):
//
//   async rewrites() {
//     const convex = process.env.NEXT_PUBLIC_CONVEX_URL;
//     const site = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
//     if (!convex || !site) return [];
//     return [
//       { source: "/api/:version(\\d+\\.\\d+\\.\\d+)/:path*", destination: `${convex}/api/:version/:path*` },
//       { source: "/convex-http/:path*", destination: `${site}/:path*` },
//     ];
//   },
//
// See docs/deployment/ for the full picture.
const nextConfig = {};

export default nextConfig;
