import { v } from "convex/values";
import { query } from "./_generated/server";

// Runs inside the Better Auth component, so it can read the `user` table
// directly. Exposed to the app via `components.betterAuth.users.countAdmins`.
export const countAdmins = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const users = await ctx.db.query("user").collect();
    return users.filter((entry) => entry.role === "admin" || entry.role === "superadmin").length;
  },
});
