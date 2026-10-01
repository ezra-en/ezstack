import { defineApp } from "convex/server";
import betterAuth from "./betterAuth/convex.config";

const app = defineApp();

app.use(betterAuth);

export default app;

// NOTE: typed `env` declarations (SITE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS, …)
// will be added alongside the CORS/auth pass so the first push isn't blocked on
// variables that can only be set after the deployment exists.
