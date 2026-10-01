import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/convex/betterAuth/auth";

export const authClient = createAuthClient({
	plugins: [
		convexClient(),
		adminClient(),
		inferAdditionalFields<typeof auth>(),
	],
});
