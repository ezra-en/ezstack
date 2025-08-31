import {
  zid,
  zodOutputToConvex,
  zodToConvex,
  zodToConvexFields,
} from "convex-helpers/server/zod";
import { defineSchema, defineTable } from "convex/server";
import { z } from "zod/v3";

export const taskSchema = z.object({
  _id: zid("tasks"),
  text: z.string(),
  isCompleted: z.boolean(),
});

export default defineSchema({
  users: defineTable({
    // Fields are optional
  }),
  tasks: defineTable(zodToConvex(taskSchema)),
});
