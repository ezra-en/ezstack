"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Spinner } from "@/components/ui/kibo-ui/spinner";
import { SignInUp } from "@/components/auth/sign-in-up";

export default function Home() {
  return (
    <>
      <Unauthenticated>
        <main className="flex flex-col items-center justify-between p-24">
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
        <App />
      </Authenticated>
    </>
  );
}

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function App() {
  const user = useQuery(api.auth.getCurrentUser, {});
  const messages = useQuery(api.chat.getMessages, {}) ?? [];
  const sendMessage = useMutation(api.chat.sendMessage);
  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);

  return (
    <main className="flex flex-col items-center bg-secondary-background">
      <header className="w-full flex flex-col items-center justify-center gap-1 bg-primary text-white text-center h-20 shadow-md">
        <h1 className="text-lg font-semibold tracking-tight m-0">
          Convex Chat
        </h1>
        <p className="m-0 relative font-light pl-5">
          Connected as{" "}
          <strong className="font-semibold">{user?.name ?? ""}</strong>
        </p>
      </header>
      <div className="w-full max-w-md flex-1 pt-24 pb-24 px-2">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-6 flex flex-col ${
              message.user === user?.name ? "items-end" : "items-start"
            }`}
          >
            <span className="text-sm font-medium text-primary-text mb-1">
              {message.user}
            </span>
            <div
              className={`rounded-2xl px-5 py-3 text-base shadow-md ${
                message.user === user?.name
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-white text-secondary-text rounded-bl-none"
              }`}
            >
              {message.body}
            </div>
          </div>
        ))}
      </div>
      <form
        className="fixed bottom-2 left-2 w-[calc(100%-16px)] h-18 bg-white/80 backdrop-blur-lg rounded-2xl flex items-center px-4 shadow-lg"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!user?.name || !newMessageText) return;
          await sendMessage({ user: user.name, body: newMessageText });
          setNewMessageText("");
        }}
      >
        <input
          className="flex-1 bg-transparent text-lg px-4 py-2 border-0 outline-none text-primary-text placeholder:text-tertiary-text"
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          placeholder="Write a message…"
          autoFocus
        />
        <button
          type="submit"
          disabled={!newMessageText}
          className="ml-2 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center transition-opacity disabled:opacity-70"
        >
          <span className="sr-only">Send</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </main>
  );
}

// ...existing code...
