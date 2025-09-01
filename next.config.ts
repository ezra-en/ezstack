import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Only rewrite Convex version-specific API routes (like /api/1.26.2/sync)
      // This leaves your Next.js /api/auth and /api/convex routes intact
      {
        source: "/api/:version(\\d+\\.\\d+\\.\\d+)/:path*",
        destination: "http://localhost:3210/api/:version/:path*",
      },
    ];
  },
  // Configure headers for WebSocket upgrades on Convex routes only
  async headers() {
    return [
      {
        source: "/api/:version(\\d+\\.\\d+\\.\\d+)/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, Upgrade, Connection",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
