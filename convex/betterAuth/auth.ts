import type { GenericCtx } from "@convex-dev/better-auth";
import type { DataModel } from "../_generated/dataModel";
import { createAuth } from "../auth";

// Export a static instance for Better Auth schema generation.
// This file should only contain the `auth` export: importing it at runtime
// would trigger errors due to missing environment variables.
export const auth = createAuth({} as GenericCtx<DataModel>);
