import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "./redux/slices/authSlice";
import { checkAuthAPI } from "./api/authApi";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoutes";
import MainLayout from "./components/layout/mainLayout";

// Public Pages
import Home from "./pages/public/homePage";
import Login from "./pages/public/loginPage";
import Register from "./pages/public/registerPage";
import ForgotPassword from "./pages/public/forgetPassword";

// Customer Pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MyBookings from "./pages/customer/myBookings";
import ProviderProfile from "./pages/customer/providerProfile";

// Provider Pages
import ProviderDashboard from "./pages/provider/providerDashBoard";
import ManageJobs from "./pages/provider/manageJobs";
import EditProfile from "./pages/provider/editProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/adminDashBoard";
import ApproveProviders from "./pages/admin/approveProviders";
import ManageCategories from "./pages/admin/managerCategories";

function App() {
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await checkAuthAPI();
        // The cookie is valid! Save the user to Redux.
        dispatch(setCredentials(response.user));
      } catch (error) {
        // No valid cookie, or it expired. Ensure Redux is cleared.
        dispatch(logout());
      } finally {
        // Stop the loading screen
        setIsCheckingAuth(false);
      }
    };

    verifySession();
  }, [dispatch]);

  // Show a full-screen spinner while we check the cookie
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">
          Loading your session...
        </div>
      </div>
    );
  }

  return (
    // ... your other imports ...

    // Inside your App component's return statement:
    <BrowserRouter>
      <Routes>
        {/* 🌟 THIS WRAPS EVERY SINGLE PAGE IN OUR LAYOUT 🌟 */}
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Customer Routes */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/bookings" element={<MyBookings />} />
            <Route
              path="/customer/provider/:id"
              element={<ProviderProfile />}
            />
          </Route>

          {/* Provider Routes */}
          <Route element={<ProtectedRoute allowedRoles={["provider"]} />}>
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/provider/jobs" element={<ManageJobs />} />
            <Route path="/provider/profile" element={<EditProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/approve-providers"
              element={<ApproveProviders />}
            />
            <Route path="/admin/categories" element={<ManageCategories />} />
          </Route>

          {/* Catch-All */}
          <Route
            path="*"
            element={
              <div className="p-8 text-2xl font-bold">404 - Page Not Found</div>
            }
          />
        </Route>{" "}
        {/* End of MainLayout */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
