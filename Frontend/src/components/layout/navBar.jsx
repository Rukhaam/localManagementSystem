import { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { logoutUserAPI } from "../../api/authApi"; // 🌟 IMPORTANT: Import the API function!

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUserAPI(); 
    } catch (error) {
      console.error("Failed to log out from server", error);
    } finally {

      dispatch(logout());
      navigate("/login");
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "provider") return "/provider/dashboard";
    return "/customer/dashboard";
  };

  // Get dynamic sidebar links to display in the mobile menu
  const getSidebarLinks = () => {
    const role = user?.role?.toLowerCase().trim();
    if (role === "admin") {
      return [
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Approve Providers", path: "/admin/approve-providers" },
        { name: "Categories", path: "/admin/categories" },
      ];
    }
    if (role === "provider") {
      return [
        { name: "Dashboard", path: "/provider/dashboard" },
        { name: "Manage Jobs", path: "/provider/jobs" },
        { name: "My Profile", path: "/provider/profile" },
      ];
    }
    if (role === "customer") {
      return [
        { name: "Dashboard", path: "/customer/dashboard" },
        { name: "My Bookings", path: "/customer/bookings" },
      ];
    }
    return [];
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">L</span>
              </div>
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">LocalHub</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Explore Services</Link>
            </li>
            <li>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">How it Works</a>
            </li>
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500">Hi, {user?.name?.split(" ")[0]}</span>
                <Link to={getDashboardLink()} className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">Dashboard</Link>
                <button onClick={handleLogout} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">Log out</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Log in</Link>
                <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">Sign up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none p-2" aria-label="Toggle Menu">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0">
          <ul className="px-4 pt-2 pb-4 space-y-1">
            <li>
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                Home
              </Link>
            </li>
            <li>
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                Explore Services
              </Link>
            </li>

            <li className="border-t border-gray-100 mt-4 pt-4">
              <ul className="space-y-1">
                {isAuthenticated ? (
                  <>
                    <li className="mb-4">
                      <div className="px-3 text-xs uppercase text-gray-400 font-bold tracking-wider mb-2">{user?.role} Menu</div>
                      <ul className="space-y-1">
                        {getSidebarLinks().map((link) => (
                          <li key={link.name}>
                            <NavLink
                              to={link.path}
                              onClick={() => setIsOpen(false)}
                              className={({ isActive }) => `block px-3 py-2 text-base font-medium rounded-md ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`}
                            >
                              {link.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>

                    <li className="border-t border-gray-100 pt-2">
                      <button
                        onClick={() => { handleLogout(); setIsOpen(false); }}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        Log out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                        Log in
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md">
                        Sign up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}