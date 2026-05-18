import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Eye,
  MessageCircle,
  Trash2,
  Edit,
  LogOut,
  Menu,
  TrendingUp,
  Package,
} from "lucide-react";

interface Listing {
  _id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  views: number;
  inquiries: number;
  createdAt: string;
  status: string;
}

interface Stats {
  totalListings: number;
  activeListings: number;
  inactiveListings: number;
  totalViews: number;
  totalInquiries: number;
  listingsByType: Array<{ _id: string; count: number }>;
}

const AgentDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsData, statsData] = await Promise.all([
          apiClient.get("/api/agent/my-listings", token!),
          apiClient.get("/api/agent/stats", token!),
        ]);
        setListings(listingsData.listings);
        setStats(statsData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, toast]);

  const handleDeleteListing = async (listingId: string) => {
    try {
      await apiClient.delete(`/api/listings/${listingId}`, token!);
      setListings(listings.filter((l) => l._id !== listingId));
      toast({
        title: "Success",
        description: "Listing deleted",
      });
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
              <h2 className="text-lg font-bold text-foreground">Agent Panel</h2>
              <p className="text-sm text-muted-foreground">{user?.fullName}</p>
              {user?.companyName && (
                <p className="text-xs text-muted-foreground">{user.companyName}</p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={() => navigate("/agent/create-listing")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Listing
            </Button>

            <nav className="space-y-2">
              <Button
                variant="default"
                className="w-full justify-start"
                onClick={() => navigate("/agent/dashboard")}
              >
                Dashboard
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
                <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage your listings</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Total Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalListings}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.activeListings}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalViews}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Inquiries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalInquiries}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg. per Listing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalListings
                      ? Math.round(
                          (stats.totalInquiries / stats.totalListings) * 100
                        ) / 100
                      : 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Listings Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Listings ({listings.length})</CardTitle>
                <Button onClick={() => navigate("/agent/create-listing")}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Listing
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Inquiries</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            No listings yet. Create your first listing!
                          </TableCell>
                        </TableRow>
                      ) : (
                        listings.map((listing) => (
                          <TableRow key={listing._id}>
                            <TableCell className="font-medium">
                              {listing.title}
                            </TableCell>
                            <TableCell>{listing.type}</TableCell>
                            <TableCell>{listing.location}</TableCell>
                            <TableCell>${listing.price}</TableCell>
                            <TableCell>{listing.views}</TableCell>
                            <TableCell>{listing.inquiries}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  listing.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {listing.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    navigate(`/agent/edit-listing/${listing._id}`)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleDeleteListing(listing._id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AgentDashboard;
