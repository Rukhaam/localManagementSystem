import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/common/loadingSpinner";

export default function ProtectedRoute({ allowedRoles, isCheckingAuth }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // 1. Wait for the initial authentication check to complete
  // This prevents kicking a user to /login on a simple page refresh
  if (isCheckingAuth) {
    return <LoadingSpinner fullScreen={true} message="Verifying secure session..." />;
  }

  // 2. If the check is done and they are NOT authenticated, send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Ensure the user role exists and is safe to check
  const safeRole = user?.role?.toLowerCase().trim();

  // 4. Check if they have the right role for this specific route
  if (allowedRoles && !allowedRoles.includes(safeRole)) {
    return <Navigate to="/" replace />;
  }

  // 5. Authorized! Render the protected page
  return <Outlet />;
}