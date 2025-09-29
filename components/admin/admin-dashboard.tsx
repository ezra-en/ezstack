"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  banned?: boolean;
  banReason?: string;
}

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  // Check if current user is admin
  useEffect(() => {
    const checkUser = async () => {
      const { data: user } = await authClient.getSession();
      setCurrentUser(user?.user);
    };
    checkUser();
  }, []);

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: { limit: 50 },
      });
      if (data) {
        setUsers(data.users);
      }
      if (error) {
        console.error("Error loading users:", error);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new user
  const createUser = async () => {
    if (!newUserEmail || !newUserName || !newUserPassword) return;

    try {
      const { data, error } = await authClient.admin.createUser({
        email: newUserEmail,
        name: newUserName,
        password: newUserPassword,
        role: "user",
      });

      if (data) {
        setNewUserEmail("");
        setNewUserName("");
        setNewUserPassword("");
        await loadUsers();
      }
      if (error) {
        console.error("Error creating user:", error);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Set user role
  const setUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await authClient.admin.setRole({
        userId,
        role,
      });
      if (!error) {
        await loadUsers();
      } else {
        console.error("Error setting role:", error);
      }
    } catch (error) {
      console.error("Error setting role:", error);
    }
  };

  // Ban user
  const banUser = async (userId: string, reason: string) => {
    try {
      const { error } = await authClient.admin.banUser({
        userId,
        banReason: reason,
      });
      if (!error) {
        await loadUsers();
      } else {
        console.error("Error banning user:", error);
      }
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  // Unban user
  const unbanUser = async (userId: string) => {
    try {
      const { error } = await authClient.admin.unbanUser({ userId });
      if (!error) {
        await loadUsers();
      } else {
        console.error("Error unbanning user:", error);
      }
    } catch (error) {
      console.error("Error unbanning user:", error);
    }
  };

  // Check permissions
  const checkPermissions = async () => {
    try {
      // Check if current user can create projects
      const { data: canCreate } = await authClient.admin.hasPermission({
        permissions: { project: ["create"] },
      });

      // Check if current user can delete projects
      const { data: canDelete } = await authClient.admin.hasPermission({
        permissions: { project: ["delete"] },
      });

      console.log("Can create projects:", canCreate);
      console.log("Can delete projects:", canDelete);

      // Check role permissions without server call
      const adminCanDelete = authClient.admin.checkRolePermission({
        permissions: { user: ["delete"] },
        role: "admin",
      });

      console.log("Admin role can delete users:", adminCanDelete);
    } catch (error) {
      console.error("Error checking permissions:", error);
    }
  };

  // Check if current user is admin
  const isAdmin = currentUser?.role === "admin";

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You need admin privileges to access this dashboard.</p>
          <p>Current role: {currentUser?.role || "No role"}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome, {currentUser?.name}! You have admin access.</p>
          <div className="mt-4">
            <Button onClick={checkPermissions}>Check My Permissions</Button>
          </div>
        </CardContent>
      </Card>

      {/* Create User */}
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <Button onClick={createUser}>Create User</Button>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={loadUsers} disabled={loading}>
              {loading ? "Loading..." : "Refresh Users"}
            </Button>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-sm">Role: {user.role}</p>
                    {user.banned && (
                      <p className="text-sm text-red-600">
                        Banned: {user.banReason || "No reason provided"}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {/* Role Management */}
                    <select
                      value={user.role}
                      onChange={(e) => setUserRole(user.id, e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="myCustomRole">Custom Role</option>
                    </select>

                    {/* Ban/Unban */}
                    {user.banned
                      ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unbanUser(user.id)}
                        >
                          Unban
                        </Button>
                      )
                      : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => banUser(user.id, "Admin action")}
                        >
                          Ban
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
