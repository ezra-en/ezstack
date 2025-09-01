"use client";

import { useState } from "react";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { authClient } from "@/lib/auth-client";
import { api } from "../../convex/_generated/api";
import { Card } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-12">
      <AuthLoading>
        <div className="text-center text-base sm:text-lg">
          Loading authentication...
        </div>
      </AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <Dashboard />
      </Authenticated>
    </main>
  );
}

function Dashboard() {
  const user = useQuery(api.auth.getCurrentUser);
  const tasks = useQuery(api.tasks.getAllTasks);
  const toggleTask = useMutation(api.tasks.toggleTask);

  return (
    <div className="w-full max-w-2xl">
      {/* User Info Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 break-words">
          Welcome, {user?.name || user?.email}!
        </h1>
        <button
          onClick={() => authClient.signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm sm:text-base"
        >
          Sign out
        </button>
      </div>

      {/* Tasks Section */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
          Your Tasks
        </h2>
        {tasks?.length === 0
          ? (
            <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
              No tasks yet. Create some tasks in your database!
            </p>
          )
          : (
            tasks?.map(({ _id, text, isCompleted }) => (
              <Card
                key={_id}
                className="w-full p-3 sm:p-4 flex flex-row items-center gap-3 sm:gap-4"
              >
                <Checkbox
                  id={`checkbox-${_id}`}
                  checked={isCompleted}
                  onCheckedChange={async (checked) =>
                    await toggleTask({ _id, isCompleted: checked === true })}
                  className="flex-shrink-0"
                />
                <label
                  htmlFor={`checkbox-${_id}`}
                  className={`cursor-pointer select-none flex-1 text-sm sm:text-base break-words ${
                    isCompleted ? "line-through text-gray-500" : ""
                  }`}
                >
                  {text}
                </label>
              </Card>
            ))
          )}
      </div>
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
    <div className="w-full max-w-md">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Task Manager</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Sign in to manage your tasks
        </p>
      </div>

      <Card className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!showSignIn && (
            <input
              name="name"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base font-medium"
          >
            {showSignIn ? "Sign in" : "Sign up"}
          </button>
        </form>

        <p className="text-center mt-4 text-xs sm:text-sm text-gray-600">
          {showSignIn ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setShowSignIn(!showSignIn)}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            {showSignIn ? "Sign up" : "Sign in"}
          </button>
        </p>
      </Card>
    </div>
  );
}
