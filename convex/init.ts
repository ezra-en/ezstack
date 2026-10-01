import { v } from "convex/values";
import { components } from "./_generated/api";
import { internalMutation } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

/**
 * Create the first admin user.
 *
 * There are intentionally no defaults: pass explicit credentials. Runnable
 * from the Convex dashboard (Functions → init:bootstrapAdmin) or the CLI:
 *
 *   bunx convex run init:bootstrapAdmin \
 *     '{"email":"you@example.com","password":"…","name":"You"}'
 *
 * Refuses to run once any admin exists.
 */
export const bootstrapAdmin = internalMutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  returns: v.object({ userId: v.string() }),
  handler: async (ctx, args) => {
    const adminCount = await ctx.runQuery(
      components.betterAuth.users.countAdmins,
      {},
    );
    if (adminCount > 0) {
      throw new Error(
        "An admin already exists; refusing to bootstrap another.",
      );
    }

    const { auth } = await authComponent.getAuth(createAuth, ctx);
    const result = await auth.api.createUser({
      body: {
        email: args.email,
        password: args.password,
        name: args.name,
        role: "admin",
      },
    });

    if (!result?.user) {
      throw new Error("Failed to create the admin user.");
    }
    return { userId: result.user.id };
  },
});
