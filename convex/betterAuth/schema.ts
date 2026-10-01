import { defineSchema } from "convex/server";
import { tables } from "./generatedSchema";

// Do not edit the generated tables directly — customize Better Auth's schema
// through its options, or track tables with app tables using triggers:
// https://www.better-auth.com/docs/concepts/database#extending-core-schema
// https://labs.convex.dev/better-auth/triggers
//
// Add custom indexes here (they survive regeneration), e.g.:
//   user: tables.user.index("custom_index", ["fieldA", "fieldB"]),
const schema = defineSchema({
  ...tables,
});

export default schema;
