import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getToken } from "@/lib/auth-server";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ezstack",
  description: "Convex + Better Auth + vinext starter",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const token = await getToken();
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider initialToken={token}>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
