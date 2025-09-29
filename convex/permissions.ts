import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements, // Include default admin permissions (user, session)
  project: ["create", "share", "update", "delete"], // <-- Custom permissions for projects
} as const;

export const ac = createAccessControl(statement);

// Override default roles to include both default admin permissions and custom permissions
export const user = ac.newRole({
  project: ["create"],
  // Users can't perform admin operations by default
});

export const admin = ac.newRole({
  project: ["create", "update"],
  ...adminAc.statements, // Include all default admin permissions
});

export const myCustomRole = ac.newRole({
  project: ["create", "update", "delete"],
  user: ["ban"], // Can ban users but not full admin permissions
});
