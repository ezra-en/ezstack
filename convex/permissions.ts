import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";

// Add your app's own resources/permissions here.
export const statement = {
  ...defaultStatements,
  project: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  ...userAc.statements,
});

export const admin = ac.newRole({
  ...adminAc.statements,
});

export const superadmin = ac.newRole({
  ...adminAc.statements,
  project: ["create", "update", "delete"],
});
