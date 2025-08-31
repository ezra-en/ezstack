import { mutation, query } from "./_generated/server";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { taskSchema } from "./schema";
import { z } from "zod/v3";
import { betterAuthComponent } from "./auth";
import { Id } from "./_generated/dataModel";

const zQuery = zCustomQuery(query, NoOp);

export const getAllTasks = zQuery({
  args: {},
  handler: async (ctx) => {
    // Check if user is authenticated
    const userId = await betterAuthComponent.getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated to view tasks");
    }

    // For now, return all tasks, but you could filter by user
    // return await ctx.db.query("tasks").filter(q => q.eq(q.field("userId"), userId)).collect();
    return await ctx.db.query("tasks").collect();
  },
  returns: z.array(taskSchema),
});

const zMutation = zCustomMutation(mutation, NoOp);

export const toggleTask = zMutation({
  args: taskSchema.omit({ text: true }),
  handler: async (ctx, args) => {
    // Check if user is authenticated
    const userId = await betterAuthComponent.getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated to modify tasks");
    }

    const { _id, isCompleted } = args;

    // Optional: Verify the task exists and belongs to the user
    const existingTask = await ctx.db.get(_id);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    await ctx.db.patch(_id, {
      isCompleted,
    });

    const updatedTask = await ctx.db.get(_id);
    if (!updatedTask) {
      throw new Error("Task not found after update");
    }

    console.log(`Task ${_id} toggled by user ${userId}:`, updatedTask);
    return updatedTask;
  },
  returns: taskSchema,
});

// Optional: Add a function to create new tasks
export const createTask = zMutation({
  args: {
    text: z.string(),
  },
  handler: async (ctx, args) => {
    // Check if user is authenticated
    const userId = await betterAuthComponent.getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated to create tasks");
    }

    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      // If you want user-specific tasks, add userId field to schema and uncomment:
      // userId: userId as Id<"users">,
    });

    const newTask = await ctx.db.get(taskId);
    return newTask!;
  },
  returns: taskSchema,
});
