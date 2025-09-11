"use client";

import { useState } from "react";
import { ArrowRight, Key, LogOut, Mail, User, UserPlus } from "lucide-react";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { authClient } from "@/lib/auth-client";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <AuthLoading>
        <div className="text-lg text-gray-500">Loading...</div>
      </AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <Dashboard />
      </Authenticated>
    </div>
  );
}

function Dashboard() {
  const user = useQuery(api.auth.getCurrentUser);
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-2">
        <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <div className="text-2xl font-bold tracking-tight">
          Hello {user?.name}!
        </div>
      </div>
      <div className="text-center text-gray-600 dark:text-gray-300 mb-4">
        Go back to the{" "}
        <Link href="/" className="underline hover:no-underline">
          homepage route
        </Link>{" "}
        to see that your name has updated there too!
      </div>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 flex items-center gap-2"
        onClick={() => authClient.signOut()}
      >
        <LogOut className="w-5 h-5" />
        Sign out
      </button>
    </div>
  );
}

function SignIn() {
  const [showSignIn, setShowSignIn] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if (showSignIn) {
      await authClient.signIn.email(
        {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        },
        {
          onError: (ctx) => {
            window.alert(ctx.error.message);
          },
        },
      );
    } else {
      await authClient.signUp.email(
        {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        },
        {
          onError: (ctx) => {
            window.alert(ctx.error.message);
          },
        },
      );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col gap-8 border border-slate-200 dark:border-slate-700">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          {!showSignIn && (
            <div className="relative">
              <input
                name="name"
                placeholder="Name"
                className="border rounded-lg px-4 py-3 bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all duration-200 pl-10"
              />
              <span className="absolute left-3 top-3 text-gray-400">
                <User className="w-5 h-5" />
              </span>
            </div>
          )}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border rounded-lg px-4 py-3 bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all duration-200 pl-10"
            />
            <span className="absolute left-3 top-3 text-gray-400">
              <Mail className="w-5 h-5" />
            </span>
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border rounded-lg px-4 py-3 bg-slate-100 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all duration-200 pl-10"
            />
            <span className="absolute left-3 top-3 text-gray-400">
              <Key className="w-5 h-5" />
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex items-center gap-2"
        >
          {showSignIn
            ? <ArrowRight className="w-5 h-5" />
            : <UserPlus className="w-5 h-5" />}
          {showSignIn ? "Sign in" : "Sign up"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        {showSignIn ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          className="underline text-blue-600 dark:text-blue-400 hover:no-underline ml-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          onClick={() => setShowSignIn(!showSignIn)}
        >
          {showSignIn ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
