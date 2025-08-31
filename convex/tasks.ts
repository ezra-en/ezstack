import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { zCustomMutation, zCustomQuery, zid } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import z from "zod/v3";

const taskSchema = z.object({
  _id: zid("tasks"),
  isCompleted: z.boolean(),
});

const zQuery = zCustomQuery(query, NoOp);

export const getAllTasks = zQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

const zMutation = zCustomMutation(mutation, NoOp);
export const toggleTask = zMutation({
  args: taskSchema,
  handler: async (ctx, args) => {
    const { _id, isCompleted } = args;
    await ctx.db 
      .patch(_id, {
        isCompleted,
      });
    console.log(await ctx.db.get(_id));
    return await ctx.db.get(_id);
  },
  returns: taskSchema
});
