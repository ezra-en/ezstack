import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function SignInUp() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
        rememberMe: false,
      });
      if (signInError) {
        setError(signInError.message || "Sign in failed");
      } else {
        // Optionally redirect or show success
        // window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
        image,
        callbackURL: "/",
      });
      if (signUpError) {
        setError(signUpError.message || "Sign up failed");
      } else {
        // Optionally redirect or show success
        // window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {mode === "signIn" ? "Login to your account" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {mode === "signIn"
            ? "Enter your email below to login to your account"
            : "Enter your details below to create a new account"}
        </CardDescription>
        <CardAction>
          <Button
            variant="link"
            onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
          >
            {mode === "signIn" ? "Sign Up" : "Sign In"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {mode === "signIn"
          ? (
            <form onSubmit={handleSignIn}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      className="pe-9"
                      placeholder="Password"
                      type={isVisible ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      aria-pressed={isVisible}
                      aria-controls="password"
                    >
                      {isVisible
                        ? <EyeOffIcon size={16} aria-hidden="true" />
                        : <EyeIcon size={16} aria-hidden="true" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </div>
            </form>
          )
          : (
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      className="pe-9"
                      placeholder="Password"
                      type={isVisible ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      aria-pressed={isVisible}
                      aria-controls="password"
                    >
                      {isVisible
                        ? <EyeOffIcon size={16} aria-hidden="true" />
                        : <EyeIcon size={16} aria-hidden="true" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </div>
            </form>
          )}
      </CardContent>
      {/* No CardFooter submit button needed; submit is inside each form */}
    </Card>
  );
}
