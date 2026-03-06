import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux"; // Import Redux hook

export default function ProtectedRoute({ allowedRoles }) {
  // 1. Grab the REAL state directly from Redux!
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // 2. If they are not logged in, kick them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Make the role lowercase and trim spaces to prevent database typos
  const safeRole = user?.role?.toLowerCase().trim();

  // 4. If their role isn't in the allowed array, kick them to the home page
  if (allowedRoles && !allowedRoles.includes(safeRole)) {
    return <Navigate to="/" replace />;
  }

  // 5. If they pass all checks, let them in!
  return <Outlet />;
}
