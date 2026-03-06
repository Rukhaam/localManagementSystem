import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./navBar";
import Sidebar from "./sideBar";
import Footer from "./footer";

export default function MainLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 1. Navbar stays fixed at the top */}
      <Navbar />

      {/* 2. Main body area (Flex row for Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Only show Sidebar if logged in */}
        {isAuthenticated && <Sidebar />}

        {/* 3. The scrollable content area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 p-6 sm:p-8">
            {/* The current page renders right here! */}
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
