"use client"; // Required for ConvexClientProvider and context usage
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import Logo from "@/components/logo";
import AvatarMenu from "@/components/navbar/avatar-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <header className="border-b px-4 md:px-6">
            <div className="flex h-16 items-center justify-between gap-4">
              {/* Left side */}
              <div className="flex items-center gap-2">
                {/* Mobile menu trigger */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="group size-8 md:hidden"
                      variant="ghost"
                      size="icon"
                    >
                      <svg
                        className="pointer-events-none"
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 12L20 12"
                          className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                        />
                        <path
                          d="M4 12H20"
                          className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                        />
                        <path
                          d="M4 12H20"
                          className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                        />
                      </svg>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-36 p-1 md:hidden">
                    <NavigationMenu className="max-w-none *:w-full">
                      <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                        {/* Navigation links go here */}
                      </NavigationMenuList>
                    </NavigationMenu>
                  </PopoverContent>
                </Popover>
                {/* Main nav */}
                <div className="flex items-center gap-6">
                  <a href="#" className="text-primary hover:text-primary/90">
                    <Logo />
                  </a>
                  {/* Navigation menu */}
                  <NavigationMenu className="max-md:hidden">
                    <NavigationMenuList className="gap-2">
                      <Authenticated>
                        <a
                          href="/admin"
                          className="text-sm text-muted-foreground hover:text-foreground px-2 py-1"
                        >
                          Admin
                        </a>
                      </Authenticated>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              </div>
              {/* Right side */}
              <div className="flex items-center gap-2">
                <Unauthenticated>
                  <Button asChild size="sm" className="text-sm">
                    <a href="/sign-in">Sign In</a>
                  </Button>
                </Unauthenticated>
                <Authenticated>
                  <AvatarMenu />
                </Authenticated>
                <AuthLoading>
                  <Button size="sm" className="text-sm" disabled>
                    Loading...
                  </Button>
                </AuthLoading>
              </div>
            </div>
          </header>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
