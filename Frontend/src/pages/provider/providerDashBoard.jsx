import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyBookings } from "../../redux/slices/bookingSlice";

export default function ProviderDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Grab bookings state directly from Redux!
  const { items: bookings, isLoading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    // Trigger the Redux thunk to fetch data
    dispatch(fetchMyBookings());
  }, [dispatch]);

  // Compute Stats
  const pendingRequests = bookings.filter(b => b.status === "Requested").length;
  const activeJobs = bookings.filter(b => ["Confirmed", "In-progress"].includes(b.status)).length;
  const completedJobs = bookings.filter(b => b.status === "Completed").length;

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 font-medium animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-500 mt-2">Here is what is happening with your service business today.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Pending Requests</div>
          <div className="text-4xl font-extrabold text-blue-600">{pendingRequests}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Active Jobs</div>
          <div className="text-4xl font-extrabold text-amber-500">{activeJobs}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Completed Jobs</div>
          <div className="text-4xl font-extrabold text-green-600">{completedJobs}</div>
        </div>
      </div>

      {/* RECENT BOOKINGS FEED */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
          <Link to="/provider/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            View all jobs &rarr;
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No booking requests yet. Make sure your Duty Status is turned on!
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentBookings.map((booking) => (
              <li key={booking.id} className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800">Booking #{booking.id}</p>
                  <p className="text-sm text-gray-500">Scheduled: {new Date(booking.scheduledDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  booking.status === 'Requested' ? 'bg-blue-100 text-blue-700' :
                  booking.status === 'Confirmed' ? 'bg-amber-100 text-amber-700' :
                  booking.status === 'In-progress' ? 'bg-purple-100 text-purple-700' :
                  booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {booking.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}