import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const safeRole = user?.role?.toLowerCase().trim();

  if (allowedRoles && !allowedRoles.includes(safeRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
