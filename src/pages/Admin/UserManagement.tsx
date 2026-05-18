import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Trash2, Menu, LogOut } from "lucide-react";

interface User {
  _id: string;
  email: string;
  fullName: string;
  role: "Admin" | "Agent" | "Client";
  isApproved: boolean;
  companyName?: string;
  createdAt: string;
}

const UserManagement = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId?: string;
  }>({ open: false });
  const [roleDialog, setRoleDialog] = useState<{
    open: boolean;
    userId?: string;
    currentRole?: string;
  }>({ open: false });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiClient.get("/api/admin/users", token!);
        setUsers(data.users);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token, toast]);

  const handleApprove = async (userId: string) => {
    try {
      await apiClient.patch(`/api/admin/users/${userId}/approve`, {}, token!);
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, isApproved: true } : u
        )
      );
      toast({
        title: "Success",
        description: "User approved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await apiClient.patch(
        `/api/admin/users/${userId}/role`,
        { role: newRole },
        token!
      );
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole as any } : u))
      );
      toast({
        title: "Success",
        description: "User role updated",
      });
      setRoleDialog({ open: false });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await apiClient.delete(`/api/admin/users/${userId}`, token!);
      setUsers(users.filter((u) => u._id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setDeleteDialog({ open: false });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`w-64 bg-card border-r border-border transition-all ${
            !sidebarOpen && "w-0"
          }`}
        >
          <div className="p-6 space-y-4">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
              <p className="text-sm text-muted-foreground">{user?.fullName}</p>
            </div>

            <nav className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/admin/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="default"
                className="w-full justify-start"
                onClick={() => navigate("/admin/users")}
              >
                User Management
              </Button>
            </nav>

            <div className="pt-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage and approve users
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Users ({users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell className="font-medium">
                            {u.fullName}
                          </TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setRoleDialog({
                                  open: true,
                                  userId: u._id,
                                  currentRole: u.role,
                                })
                              }
                            >
                              {u.role}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {u.isApproved ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-green-600">
                                    Approved
                                  </span>
                                </>
                              ) : u.role === "Agent" ? (
                                <>
                                  <XCircle className="h-4 w-4 text-orange-600" />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleApprove(u._id)}
                                  >
                                    Approve
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-green-600">
                                    Approved
                                  </span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{u.companyName || "-"}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteDialog({ open: true, userId: u._id })
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => 
        setDeleteDialog({ ...deleteDialog, open })
      }>
        <AlertDialogContent>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure? This will permanently delete the user and all their listings.
          </AlertDialogDescription>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteDialog.userId) {
                  handleDelete(deleteDialog.userId);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role Change Dialog */}
      <AlertDialog
        open={roleDialog.open}
        onOpenChange={(open) => setRoleDialog({ ...roleDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Change User Role</AlertDialogTitle>
          <AlertDialogDescription>
            Select a new role for this user
          </AlertDialogDescription>
          <Select onValueChange={(value) => 
            setRoleDialog({ ...roleDialog, currentRole: value })
          } defaultValue={roleDialog.currentRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Agent">Agent</SelectItem>
              <SelectItem value="Client">Client</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (roleDialog.userId && roleDialog.currentRole) {
                  handleChangeRole(roleDialog.userId, roleDialog.currentRole);
                }
              }}
            >
              Update Role
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default UserManagement;
