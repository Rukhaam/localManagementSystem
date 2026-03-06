import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">L</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                LocalHub
              </span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Connecting communities by bringing expert, trusted local services directly to your door.
            </p>
          </div>
          
          {/* Customers Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-100">For Customers</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Explore Services</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Create Account</Link></li>
              <li><Link to="/customer/dashboard" className="hover:text-blue-400 transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          {/* Providers Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-100">For Providers</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Join as a Professional</Link></li>
              <li><Link to="/provider/dashboard" className="hover:text-blue-400 transition-colors">Provider Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Provider Login</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} LocalHub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}