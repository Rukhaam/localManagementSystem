import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  // Define the links based on roles
  const getLinks = () => {
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
    return [
      { name: "Dashboard", path: "/customer/dashboard" },
      { name: "My Bookings", path: "/customer/bookings" },
    ];
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block flex-shrink-0">
      <div className="p-6">
        <div className="text-xs uppercase text-gray-400 font-bold tracking-wider mb-4">
          {user?.role} Menu
        </div>
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}