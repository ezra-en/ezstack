"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const isAddingAccount = searchParams?.get("add-account") === "true";
  const [existingSessions, setExistingSessions] = useState<any[]>([]);

  useEffect(() => {
    if (isAddingAccount) {
      loadExistingSessions();
    }
  }, [isAddingAccount]);

  const loadExistingSessions = async () => {
    try {
      const { data } = await authClient.multiSession.listDeviceSessions();
      setExistingSessions(data || []);
    } catch (err) {
      console.error("Error loading existing sessions:", err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isSignUp) {
        // Sign up
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
        });

        if (error) {
          setError(error.message || "Sign up failed");
          return;
        }

        if (isAddingAccount) {
          setSuccess(
            "Account added successfully! You can now switch between accounts.",
          );
        } else {
          setSuccess("Account created successfully!");
        }
      } else {
        // Sign in
        const { error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) {
          setError(error.message || "Sign in failed");
          return;
        }

        if (isAddingAccount) {
          setSuccess(
            "Account added to your session! You can now switch between accounts.",
          );
        } else {
          setSuccess("Signed in successfully!");
        }
      }

      // Redirect after successful auth
      setTimeout(() => {
        if (isAddingAccount) {
          router.push("/"); // Go back to main page
        } else {
          window.location.href = "/"; // Full page reload to update auth state
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToExistingAccount = async (sessionToken: string) => {
    setLoading(true);
    try {
      await authClient.multiSession.setActive({
        sessionToken,
      });
      router.push("/");
    } catch (error) {
      setError("Failed to switch to account");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className=" flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {isAddingAccount && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="p-0 h-auto"
            >
              <ArrowLeft size={16} />
            </Button>
            <span>Adding account to existing session</span>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isAddingAccount
                ? (
                  <>
                    <UserPlus size={20} />
                    Add Another Account
                  </>
                )
                : (
                  <>
                    <LogIn size={20} />
                    {isSignUp ? "Create Account" : "Sign In"}
                  </>
                )}
            </CardTitle>
            {isAddingAccount && (
              <p className="text-sm text-muted-foreground">
                Sign in to an existing account or create a new one to add to
                your current session.
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Show existing sessions if adding account */}
            {isAddingAccount && existingSessions.length > 0 && (
              <div className="space-y-3">
                <Label>Or switch to an existing account:</Label>
                <div className="space-y-2">
                  {existingSessions.map((session) => (
                    <Button
                      key={session.token}
                      variant={session.isActive ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() =>
                        handleSwitchToExistingAccount(session.token)}
                      disabled={session.isActive || loading}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {session.user?.name || "Unknown User"}
                        </span>
                        <span className="text-xs opacity-75">
                          {session.user?.email || "No email"}
                        </span>
                        {session.isActive && (
                          <span className="text-xs text-blue-600">Current</span>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or add new account
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Auth form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Processing..."
                  : isSignUp
                  ? (isAddingAccount ? "Add Account" : "Create Account")
                  : (isAddingAccount ? "Add Account" : "Sign In")}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={loading}
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
