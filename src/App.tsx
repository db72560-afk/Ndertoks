import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Parcels from "./pages/Parcels.tsx";
import Contractors from "./pages/Contractors.tsx";
import Materials from "./pages/Materials.tsx";
import Architects from "./pages/Architects.tsx";
import Surveying from "./pages/Surveying.tsx";
import Logistics from "./pages/Logistics.tsx";
import About from "./pages/About.tsx";
import Search from "./pages/Search.tsx";
import ParcelDetail from "./pages/ParcelDetail.tsx";
import ContractorDetail from "./pages/ContractorDetail.tsx";
import MaterialDetail from "./pages/MaterialDetail.tsx";
import ArchitectDetail from "./pages/ArchitectDetail.tsx";
import SurveyorDetail from "./pages/SurveyorDetail.tsx";
import LogisticsDetail from "./pages/LogisticsDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminDashboard from "./pages/Admin/Dashboard.tsx";
import UserManagement from "./pages/Admin/UserManagement.tsx";
import AgentDashboard from "./pages/Agent/Dashboard.tsx";
import CreateListing from "./pages/Agent/CreateListing.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/parcels" element={<Parcels />} />
            <Route path="/contractors" element={<Contractors />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/architects" element={<Architects />} />
            <Route path="/surveying" element={<Surveying />} />
            <Route path="/logistics" element={<Logistics />} />
            <Route path="/search" element={<Search />} />
            <Route path="/parcels/:id" element={<ParcelDetail />} />
            <Route path="/contractors/:id" element={<ContractorDetail />} />
            <Route path="/materials/:id" element={<MaterialDetail />} />
            <Route path="/architects/:id" element={<ArchitectDetail />} />
            <Route path="/surveying/:id" element={<SurveyorDetail />} />
            <Route path="/logistics/:id" element={<LogisticsDetail />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute
                  element={<AdminDashboard />}
                  requiredRole="Admin"
                />
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute
                  element={<UserManagement />}
                  requiredRole="Admin"
                />
              }
            />

            {/* Agent Routes */}
            <Route
              path="/agent/dashboard"
              element={
                <ProtectedRoute
                  element={<AgentDashboard />}
                  requiredRole="Agent"
                  requireApproved={true}
                />
              }
            />
            <Route
              path="/agent/create-listing"
              element={
                <ProtectedRoute
                  element={<CreateListing />}
                  requiredRole="Agent"
                  requireApproved={true}
                />
              }
            />
            <Route
              path="/agent/edit-listing/:id"
              element={
                <ProtectedRoute
                  element={<CreateListing />}
                  requiredRole="Agent"
                  requireApproved={true}
                />
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
