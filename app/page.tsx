"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Spinner } from "@/components/ui/kibo-ui/spinner";
import { SignInUp } from "@/components/auth/sign-in-up";

export default function Home() {
  return (
    <>
      <Unauthenticated>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="animate-in fade-in duration-50 w-full">
            <SignInUp />
          </div>
        </main>
      </Unauthenticated>
      <AuthLoading>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="loading-container min-h-screen flex flex-col items-center justify-center gap-2">
            <Spinner variant="circle" className="duration-500" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        </main>
      </AuthLoading>
      <Authenticated>
        Logged in
      </Authenticated>
    </>
  );
}
