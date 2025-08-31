import { mutation, query } from "./_generated/server";
import {
  zCustomMutation,
  zCustomQuery,
} from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { taskSchema } from "./schema";
import { z } from "zod/v3";

const zQuery = zCustomQuery(query, NoOp);

export const getAllTasks = zQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
  returns: z.array(taskSchema),
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
    const updatedTask = await ctx.db.get(_id);
    if (!updatedTask) {
      throw new Error("Task not found");
    }
    console.log(updatedTask);
    return updatedTask;
  },
  returns: taskSchema,
});
