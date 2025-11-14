import { components } from "./_generated/api";
import { internalMutation } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

// Seeds admin user
export default internalMutation({
	handler: async (ctx) => {
		const { auth } = await authComponent.getAuth(createAuth, ctx);
		if ((await ctx.runQuery(components.betterAuth.admin.checkAdmins)) !== 0)
			throw Error("Admin user already configured.");

    // Configure your credentials here
		auth.api.createUser({
			body: {
				email: "admin@example.com",
				name: "Admin",
				password: "CHANGEME",
				role: "admin",
			},
		});
	},
});
