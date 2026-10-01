import { defineApp } from "convex/server";
import { v } from "convex/values";
import betterAuth from "./betterAuth/convex.config";

// Declared, validated at push time, and read via `env` from _generated/server.
const app = defineApp({
  env: {
    SITE_URL: v.string(),
    BETTER_AUTH_SECRET: v.string(),
    CORS_ORIGINS: v.optional(v.string()),
  },
});

app.use(betterAuth);

export default app;
