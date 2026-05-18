import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: "Admin" | "Agent" | "Client";
  requireApproved?: boolean;
}

export const ProtectedRoute = ({
  element,
  requiredRole,
  requireApproved = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  if (requireApproved && !user?.isApproved) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1>Waiting for Approval</h1>
          <p>Admin needs to approve your account</p>
        </div>
      </div>
    );
  }

  return element;
};
