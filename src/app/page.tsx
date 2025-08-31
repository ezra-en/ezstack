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
    <main className="flex min-h-screen flex-col items-center p-24">
      <AuthLoading>
        <div className="text-center text-lg">Loading authentication...</div>
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
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user?.name || user?.email}!
        </h1>
        <button
          onClick={() => authClient.signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Tasks Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        {tasks?.length === 0
          ? (
            <p className="text-gray-500 text-center py-8">
              No tasks yet. Create some tasks in your database!
            </p>
          )
          : (
            tasks?.map(({ _id, text, isCompleted }) => (
              <Card
                key={_id}
                className="w-full p-4 flex flex-row items-center gap-4"
              >
                <Checkbox
                  id={`checkbox-${_id}`}
                  checked={isCompleted}
                  onCheckedChange={async (checked) =>
                    await toggleTask({ _id, isCompleted: checked === true })}
                />
                <label
                  htmlFor={`checkbox-${_id}`}
                  className={`cursor-pointer select-none flex-1 ${
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Task Manager</h1>
        <p className="text-gray-600">Sign in to manage your tasks</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!showSignIn && (
            <input
              name="name"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showSignIn ? "Sign in" : "Sign up"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
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
