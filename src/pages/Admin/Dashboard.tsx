import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users,
  CheckCircle,
  Clock,
  Package,
  LogOut,
  Menu,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Stats {
  totalUsers: number;
  totalAgents: number;
  approvedAgents: number;
  pendingApprovals: number;
  totalListings: number;
  listingsByType: Array<{ _id: string; count: number }>;
  usersByRole: Array<{ _id: string; count: number }>;
}

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!token) {
          console.error("No token available");
          setLoading(false);
          return;
        }
        console.log("Fetching admin stats with token:", token.substring(0, 20) + "...");
        const data = await apiClient.get("/api/admin/stats", token);
        setStats(data);
      } catch (error: any) {
        console.error("Failed to load statistics:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [token, toast]);

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
                variant="default"
                className="w-full justify-start"
                onClick={() => navigate("/admin/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
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
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back, {user?.fullName}
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Approved Agents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.approvedAgents}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pending Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats?.pendingApprovals}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Active Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalListings}</div>
                </CardContent>
              </Card>
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users by Role */}
              <Card>
                <CardHeader>
                  <CardTitle>Users by Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.usersByRole.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-foreground">{item._id}</span>
                        <span className="font-bold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Listings by Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Listings by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.listingsByType.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-foreground">{item._id}</span>
                        <span className="font-bold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
