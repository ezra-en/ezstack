import { query } from "./_generated/server";

export const checkAdmins = query({
  handler: async (ctx) => {
    const admins = await ctx.db
			.query("user")
			.filter((q) => q.eq(q.field("role"), "admin"))
			.collect()
    return admins.length;
  }
})