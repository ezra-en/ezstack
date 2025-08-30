import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const toggleTask = mutation({
  args: {
    id: v.id("tasks"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, isCompleted } = args;
    await ctx.db
      .patch(id, {
        isCompleted,
      });
    console.log(await ctx.db.get(id));
  },
});
