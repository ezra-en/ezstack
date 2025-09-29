"use client";
import {
  LogOutIcon,
  PlusIcon,
  SwitchCameraIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AvatarMenu() {
  const user = useQuery(api.auth.getCurrentUser);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Load all sessions for multi-session management
  const loadSessions = async () => {
    setLoadingSessions(true);
    try {
      console.log("Loading sessions in avatar menu...");
      const result = await authClient.multiSession.listDeviceSessions();
      console.log("Sessions result:", result);
      // Ensure result.data is always an array
      if (Array.isArray(result.data)) {
        setSessions(result.data);
      } else if (result.data && typeof result.data === "object") {
        setSessions([result.data]);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Always load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Switch to a different session
  const switchSession = async (sessionToken: string) => {
    setLoading(true);
    try {
      await authClient.multiSession.setActive({
        sessionToken,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error switching session:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new account
  const addAccount = () => {
    // Redirect to sign in page in a way that preserves existing session
    window.location.href = "/sign-in?add-account=true";
  };

  // Remove a session
  const removeSession = async (sessionId: string) => {
    try {
      await authClient.multiSession.revoke({
        sessionToken: sessionId,
      });
      await loadSessions();
    } catch (error) {
      console.error("Error removing session:", error);
    }
  };

  // Sign out from all sessions
  const handleLogoutAll = async () => {
    setLoading(true);
    try {
      await authClient.multiSession.revokeAllSessions();
      window.location.reload();
    } catch (err) {
      console.error("Logout all error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sign out from current session only
  const handleLogout = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage
              src={user?.image || "./avatar.jpg"}
              alt="Profile image"
            />
            <AvatarFallback>{user?.name ? user.name[0] : "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user?.name || "Unknown User"}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user?.email || "No email"}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal opacity-75">
            Role: {user?.role || "user"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Multi-Session Management */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={addAccount}>
            <PlusIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Add Account</span>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              onSelect={(e) => {
                e.preventDefault();
                loadSessions();
              }}
            >
              <UsersIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Switch Account</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {loadingSessions
                ? (
                  <DropdownMenuItem disabled>
                    <span className="text-sm">Loading sessions...</span>
                  </DropdownMenuItem>
                )
                : sessions.length > 0
                ? (
                  <>
                    <div className="px-2 py-1 text-xs text-muted-foreground">
                      Accounts in this browser
                    </div>
                    {sessions.map((item, index) => {
                      const { session, user } = item;
                      const isCurrent =
                        session.token ===
                          user?.currentSession?.session?.token ||
                        session.token === user?.session?.token;
                      return (
                        <DropdownMenuItem
                          key={session.id || index}
                          onClick={() => switchSession(session.token)}
                          className={isCurrent ? "bg-accent" : ""}
                          disabled={!session.token}
                        >
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-medium truncate">
                              {user?.name || user?.email || "Unknown User"}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {user?.email}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Role: {user?.role || "user"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {session.userAgent
                                ? session.userAgent.includes("Chrome")
                                  ? "Chrome"
                                  : session.userAgent.includes("Firefox")
                                  ? "Firefox"
                                  : session.userAgent.includes("Safari")
                                  ? "Safari"
                                  : "Unknown Browser"
                                : "Unknown Browser"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Last active:{" "}
                              {new Date(session.updatedAt).toLocaleDateString()}
                            </span>
                            {isCurrent && (
                              <span className="text-xs text-blue-600">
                                • Current Session
                              </span>
                            )}
                          </div>
                          {!isCurrent && session.token && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSession(session.token);
                              }}
                            >
                              ×
                            </Button>
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                    {sessions.length > 1 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleLogoutAll()}
                          className="text-destructive"
                        >
                          <LogOutIcon size={14} className="mr-2" />
                          <span className="text-sm">Sign out all accounts</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )
                : (
                  <DropdownMenuItem disabled>
                    <span className="text-sm">No accounts found</span>
                  </DropdownMenuItem>
                )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href="/test-sessions"
                  className="text-sm text-muted-foreground"
                >
                  Debug Sessions
                </a>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Account Management */}
        {user?.role === "admin" && (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <a href="/admin">
                <UserIcon size={16} className="opacity-60" aria-hidden="true" />
                <span>Admin Dashboard</span>
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}

        <DropdownMenuSeparator />

        {/* Logout Options */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout} disabled={loading}>
            <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>{loading ? "Signing out..." : "Sign Out"}</span>
          </DropdownMenuItem>

          {sessions.length > 1 && (
            <DropdownMenuItem onClick={handleLogoutAll} disabled={loading}>
              <SwitchCameraIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>
                {loading ? "Signing out..." : "Sign Out All Accounts"}
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
