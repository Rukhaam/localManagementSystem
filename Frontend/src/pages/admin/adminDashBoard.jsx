import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useDebounce from "../../hooks/debounceHook"; 
import usePagination from "../../hooks/usePagination"; 
import { fetchAllUsers, fetchAllBookings } from "../../redux/slices/adminSlice"; 

export default function AdminDashboard() {
  const dispatch = useDispatch();
  
  // 🌟 FIXED BUG: Reverted users default state to []
  const { users = [], allBookings = [], isLoading, error } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [auditModal, setAuditModal] = useState(null); 

  useEffect(() => {
    if (users.length === 0) dispatch(fetchAllUsers());
    if (allBookings.length === 0) dispatch(fetchAllBookings());
  }, [dispatch, users.length, allBookings.length]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredUsers = users.filter((user) => {
    const term = debouncedSearchTerm.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.role && user.role.toLowerCase().includes(term))
    );
  });

  const { 
    next: nextUser, prev: prevUser, jump: jumpUser, 
    currentData: currentUsers, currentPage: userPage, maxPage: maxUserPage 
  } = usePagination(filteredUsers, 5);

  const { 
    next: nextBooking, prev: prevBooking, 
    currentData: currentBookings, currentPage: bookingPage, maxPage: maxBookingPage 
  } = usePagination(allBookings, 6);

  useEffect(() => {
    jumpUser(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Command Center</h1>
        <p className="text-gray-500 mt-2">Manage users, audit completed jobs, and oversee platform activity.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">{error}</div>
      )}

      {/* Admin Tabs */}
      <div className="flex space-x-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
        <button onClick={() => setActiveTab("users")} className={`py-3 px-2 font-bold text-sm transition-colors border-b-2 ${activeTab === "users" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
          Manage Users
        </button>
        <button onClick={() => setActiveTab("bookings")} className={`py-3 px-2 font-bold text-sm transition-colors border-b-2 ${activeTab === "bookings" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
          Job Audits (Photos)
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="text-blue-600 font-bold animate-pulse">Loading Admin Data...</div>
        </div>
      )}

      {/* ========================================== */}
      {/* USERS TAB WITH SEARCH BAR                  */}
      {/* ========================================== */}
      {!isLoading && activeTab === "users" && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Search by name, email, or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-shadow"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          </div>

          {/* 🌟 REPLACED HTML TABLE WITH RESPONSIVE CSS GRID */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Desktop Header - Hidden on Mobile */}
            <div className="hidden md:grid grid-cols-5 bg-gray-50 border-b border-gray-100 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div>ID</div>
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div className="text-right">Action</div>
            </div>

            {/* List Body */}
            <div className="divide-y divide-gray-100">
              {currentUsers().length > 0 ? currentUsers().map((u) => (
                <div key={u.id} className="flex flex-col md:grid md:grid-cols-5 md:items-center px-6 py-4 hover:bg-gray-50 gap-2 md:gap-4 transition-colors">
                  
                  {/* Mobile ID is hidden, Desktop ID shown */}
                  <div className="text-sm text-gray-500 hidden md:block">#{u.id}</div>
                  
                  {/* Name & Mobile ID */}
                  <div className="flex justify-between items-start md:block">
                    <div className="font-bold text-gray-800">{u.name}</div>
                    <div className="text-xs font-mono text-gray-400 md:hidden">#{u.id}</div>
                  </div>
                  
                  <div className="text-sm text-gray-600 truncate">{u.email}</div>
                  
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.role === 'provider' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </div>
                  
                  <div className="mt-3 md:mt-0 md:text-right">
                    <button className="text-red-600 bg-red-50 md:bg-transparent px-4 py-2 md:px-0 md:py-0 w-full md:w-auto rounded-lg text-sm font-bold hover:text-red-800 hover:bg-red-100 md:hover:bg-transparent transition-colors">
                      Suspend
                    </button>
                  </div>
                </div>
              )) : (
                <div className="px-6 py-8 text-center text-gray-500">No users match your search.</div>
              )}
            </div>
            
            {/* Pagination Controls */}
            {maxUserPage > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 gap-4">
                <span className="text-sm text-gray-700">Page <span className="font-bold">{userPage}</span> of <span className="font-bold">{maxUserPage}</span></span>
                <div className="flex space-x-2 w-full sm:w-auto">
                  <button onClick={prevUser} disabled={userPage === 1} className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">Previous</button>
                  <button onClick={nextUser} disabled={userPage === maxUserPage} className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* BOOKINGS & PHOTO AUDITS TAB                */}
      {/* ========================================== */}
      {!isLoading && activeTab === "bookings" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBookings().length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No bookings found on the platform yet.
              </div>
            ) : (
              currentBookings().map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <h3 className="font-bold text-gray-800">Job #{booking.id}</h3>
                      <span className={`px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider ${booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600"><strong>Customer:</strong> {booking.customer_name || `User #${booking.customer_id}`}</p>
                    <p className="text-sm text-gray-600"><strong>Provider:</strong> {booking.provider_name || `Provider #${booking.provider_id}`}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2"><strong>Notes:</strong> {booking.notes || "None"}</p>
                  </div>
                  
                  {booking.status === "Completed" && (
                    <button 
                      onClick={() => setAuditModal(booking)}
                      className="mt-6 w-full bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Evidence Photos
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {maxBookingPage > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white rounded-xl shadow-sm border border-gray-100 gap-4">
              <span className="text-sm text-gray-700">Page <span className="font-bold">{bookingPage}</span> of <span className="font-bold">{maxBookingPage}</span></span>
              <div className="flex space-x-2 w-full sm:w-auto">
                <button onClick={prevBooking} disabled={bookingPage === 1} className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">Previous</button>
                <button onClick={nextBooking} disabled={bookingPage === maxBookingPage} className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal is completely hidden on mobile until clicked, so it's responsive inherently */}
      {auditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all" onClick={() => setAuditModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">Job #{auditModal.id} Audit</h3>
              <button onClick={() => setAuditModal(null)} className="text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Before</span>
                <div className="bg-gray-100 rounded-xl h-48 md:h-64 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {auditModal.before_image_url || auditModal.beforeImage ? (
                    <img src={auditModal.before_image_url || auditModal.beforeImage} alt="Before" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 font-medium text-sm">No image uploaded</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">After</span>
                <div className="bg-gray-100 rounded-xl h-48 md:h-64 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {auditModal.after_image_url || auditModal.afterImage ? (
                    <img src={auditModal.after_image_url || auditModal.afterImage} alt="After" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 font-medium text-sm">No image uploaded</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}