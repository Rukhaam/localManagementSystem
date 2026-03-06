import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyBookings, updateBookingStatus, clearBookingMessages } from "../../redux/slices/bookingSlice";
import { submitReview, clearReviewMessages } from "../../redux/slices/reviewSlice"; 
import { Link } from "react-router-dom";

export default function MyBookings() {
  const dispatch = useDispatch();
  
  // States from Redux
  const { items: bookings, isLoading: bookingsLoading, error: bookingError, successMessage: bookingSuccess } = useSelector((state) => state.bookings);
  const { isLoading: reviewLoading, error: reviewError, successMessage: reviewSuccess } = useSelector((state) => state.reviews);
  
  // UI State
  const [activeTab, setActiveTab] = useState("active");
  
  // 🌟 Review Modal State
  const [reviewingBookingId, setReviewingBookingId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    dispatch(fetchMyBookings());
    return () => {
      dispatch(clearBookingMessages());
      dispatch(clearReviewMessages());
    };
  }, [dispatch]);

  const activeBookings = bookings.filter(b => ["Requested", "Confirmed", "In-progress"].includes(b.status));
  const historyBookings = bookings.filter(b => ["Completed", "Cancelled"].includes(b.status));
  const currentBookings = activeTab === "active" ? activeBookings : historyBookings;

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking request?")) {
      dispatch(updateBookingStatus({ bookingId, status: "Cancelled" }));
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    dispatch(submitReview({ bookingId: reviewingBookingId, ...reviewData }))
      .unwrap()
      .then(() => {
        setReviewingBookingId(null); // Close modal on success
        setReviewData({ rating: 5, comment: "" }); // Reset form
      })
      .catch(() => {}); // Error handled by Redux state
  };

  // 🌟 HELPER FUNCTION: Safe Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return "No Date Set";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date Pending"; 
    
    return date.toLocaleDateString("en-US", {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (bookingsLoading && bookings.length === 0) {
    return <div className="p-12 text-center text-gray-500 animate-pulse">Loading your bookings...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 mt-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
        <p className="text-gray-500 mt-2">Track your active service requests and past jobs.</p>
      </div>

      {/* Global Alerts */}
      {(bookingError || reviewError) && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">
          {bookingError || reviewError}
        </div>
      )}
      {(bookingSuccess || reviewSuccess) && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium border border-green-200">
          {bookingSuccess || reviewSuccess}
        </div>
      )}

      {/* TABS */}
      <div className="flex space-x-6 border-b border-gray-200">
        <button onClick={() => setActiveTab("active")} className={`py-3 px-2 font-medium text-sm transition-colors border-b-2 ${activeTab === "active" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
          Active Jobs <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs">{activeBookings.length}</span>
        </button>
        <button onClick={() => setActiveTab("history")} className={`py-3 px-2 font-medium text-sm transition-colors border-b-2 ${activeTab === "history" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
          Past History <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs">{historyBookings.length}</span>
        </button>
      </div>

      {/* BOOKINGS LIST */}
      <div className="space-y-4">
        {currentBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">No {activeTab} bookings</h3>
            <p className="text-gray-500 mb-6">You don't have any jobs here yet.</p>
          </div>
        ) : (
          currentBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-800">Booking #{booking.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {booking.status}
                  </span>
                </div>
                {/* 🌟 DATE FIX APPLIED HERE */}
                <p className="text-sm text-gray-600"><span className="font-semibold">Date:</span> {formatDate(booking.scheduledDate || booking.scheduled_date)}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 shrink-0 md:w-48">
                {["Requested", "Confirmed"].includes(booking.status) && (
                  <button onClick={() => handleCancelBooking(booking.id)} disabled={bookingsLoading} className="w-full bg-white border border-red-200 text-red-600 text-sm font-semibold py-2 rounded-lg hover:bg-red-50">Cancel Request</button>
                )}
                
                {/* 🌟 LEAVE A REVIEW BUTTON */}
                {booking.status === "Completed" && (
                  <button 
                    onClick={() => setReviewingBookingId(booking.id)} 
                    className="w-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-semibold py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    ⭐ Leave a Review
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🌟 REVIEW MODAL */}
      {reviewingBookingId && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
          onClick={() => setReviewingBookingId(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()} 
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">Rate your experience</h3>
            <p className="text-sm text-gray-500 mb-6">How was the service for Booking #{reviewingBookingId}?</p>
            
            <form onSubmit={handleReviewSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`text-3xl focus:outline-none transition-transform hover:scale-110 ${
                        reviewData.rating >= star ? "text-yellow-400" : "text-gray-200"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment (Optional)</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Share details of your experience..."
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                ></textarea>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setReviewingBookingId(null)} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={reviewLoading} className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}