import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { type BetterAuthOptions, betterAuth } from "better-auth/minimal";
import { admin } from "better-auth/plugins";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";
import authSchema from "./betterAuth/schema";
import { getAllowedOrigins } from "./lib/origins";
import { ac, admin as adminRole, superadmin, user as userRole } from "./permissions";

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(components.betterAuth, {
  local: {
    schema: authSchema,
  },
  verbose: false,
});

// Kept separate from createAuth so the component can import the options
// without reading environment variables (see convex/betterAuth/auth.ts).
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    appName: "ezstack",
    baseURL: process.env.SITE_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    trustedOrigins: getAllowedOrigins(),
    plugins: [
      // The Convex plugin is required for Convex compatibility.
      convex({ authConfig }),
      admin({
        ac,
        roles: { user: userRole, admin: adminRole, superadmin },
        defaultRole: "user",
        adminRoles: ["admin", "superadmin"],
      }),
    ],
  } satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};

// Example function for getting the current user. Feel free to edit or omit.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.safeGetAuthUser(ctx);
  },
});
