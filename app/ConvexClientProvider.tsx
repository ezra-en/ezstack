"use client";

import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
	throw new Error(
		"Missing NEXT_PUBLIC_CONVEX_URL environment variable. Please set it in your .env.",
	);
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL, {
  // Optionally pause queries until the user is authenticated
  expectAuth: true, 
});

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
