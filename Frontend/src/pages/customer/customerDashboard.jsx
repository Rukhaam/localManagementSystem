import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyBookings } from "../../redux/slices/bookingSlice";

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    items: bookings,
    isLoading,
    error,
  } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  // Compute Stats for the Customer
  const activeBookings = bookings.filter((b) =>
    ["Requested", "Confirmed", "In-progress"].includes(b.status)
  );
  const completedBookings = bookings.filter((b) => b.status === "Completed");
  const totalSpent = completedBookings.length; // You can multiply this by rates later if you add pricing!

  // 🌟 HELPER FUNCTION: Safe Date Formatter (UI)
  const formatDate = (dateString) => {
    if (!dateString) return "No Date Set";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date Pending";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 🌟 HELPER FUNCTION: Safe Date Sorting (Prevents crashes on Invalid Dates)
  const safeGetTime = (dateStr) => {
    if (!dateStr) return 0;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  // Grab the 5 most recent bookings for the feed
  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        safeGetTime(b.scheduledDate || b.scheduled_date) -
        safeGetTime(a.scheduledDate || a.scheduled_date)
    )
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 font-medium animate-pulse">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ========================================== */}
      {/* HEADER                                     */}
      {/* ========================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Hello, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your service requests and bookings.
          </p>
        </div>
        <Link
          to="/"
          className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-center"
        >
          Book a New Service
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      {/* ========================================== */}
      {/* STATS CARDS                                */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
            Active Requests
          </div>
          <div className="text-4xl font-extrabold text-blue-600">
            {activeBookings.length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
            Services Completed
          </div>
          <div className="text-4xl font-extrabold text-green-600">
            {completedBookings.length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
            Total Bookings
          </div>
          <div className="text-4xl font-extrabold text-gray-800">
            {bookings.length}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* RECENT BOOKINGS FEED                       */}
      {/* ========================================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
          <Link
            to="/customer/bookings"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            View all history &rarr;
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="text-gray-400 mb-4 text-5xl">📅</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't requested any services. Ready to get started?
            </p>
            <Link
              to="/"
              className="text-blue-600 font-semibold hover:underline"
            >
              Browse available professionals
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentBookings.map((booking) => (
              <li
                key={booking.id}
                className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-md font-bold text-gray-800">
                      Booking #{booking.id}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        booking.status === "Requested"
                          ? "bg-blue-100 text-blue-700"
                          : booking.status === "Confirmed"
                          ? "bg-amber-100 text-amber-700"
                          : booking.status === "In-progress"
                          ? "bg-purple-100 text-purple-700"
                          : booking.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  {/* 🌟 APPLIED SAFE DATE FORMATTER HERE */}
                  <p className="text-sm text-gray-600">
                    <strong>Scheduled for:</strong>{" "}
                    {formatDate(
                      booking.scheduledDate || booking.scheduled_date
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    <strong>Address:</strong> {booking.address}
                  </p>
                </div>

                <div className="shrink-0">
                  <Link
                    to="/customer/bookings"
                    className="text-sm bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors inline-block"
                  >
                    Manage
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
