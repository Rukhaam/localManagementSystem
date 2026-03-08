import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useDebounce from "../../hooks/debounceHook";
import usePagination from "../../hooks/usePagination";
import { fetchAllUsers, fetchAllBookings } from "../../redux/slices/adminSlice";
import LoadingSpinner from "../../components/common/loadingSpinner";
import { 
  Users, 
  Image as ImageIcon, 
  Search, 
  ShieldAlert, 
  Camera,
  X
} from "lucide-react";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const {
    users = [],
    allBookings = [],
    isLoading,
  } = useSelector((state) => state.admin);

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
    next: nextUser,
    prev: prevUser,
    jump: jumpUser,
    currentData: currentUsers,
    currentPage: userPage,
    maxPage: maxUserPage,
  } = usePagination(filteredUsers, 5);

  const {
    next: nextBooking,
    prev: prevBooking,
    currentData: currentBookings,
    currentPage: bookingPage,
    maxPage: maxBookingPage,
  } = usePagination(allBookings, 6);

  useEffect(() => {
    jumpUser(1);
  }, [debouncedSearchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Admin Command Center
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Manage users, audit completed jobs, and oversee platform activity.
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="flex space-x-8 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-4 px-1 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "users"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Users size={18} /> Manage Users
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-4 px-1 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "bookings"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <ImageIcon size={18} /> Job Audits (Photos)
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner fullScreen={false} message="Loading Admin Data..." />
      ) : (
        <>
          {/* ========================================== */}
          {/* USERS TAB                                  */}
          {/* ========================================== */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-shadow"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="hidden md:grid grid-cols-5 bg-gray-50 border-b border-gray-100 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div>ID</div>
                  <div>Name</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div className="text-right">Action</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {currentUsers().length > 0 ? (
                    currentUsers().map((u) => (
                      <div key={u.id} className="flex flex-col md:grid md:grid-cols-5 md:items-center px-6 py-5 hover:bg-gray-50 gap-3 transition-colors">
                        <div className="text-sm font-mono text-gray-400 hidden md:block">#{u.id}</div>
                        <div className="flex justify-between items-start md:block">
                          <div className="font-bold text-gray-900">{u.name}</div>
                          <div className="text-xs font-mono text-gray-400 md:hidden">#{u.id}</div>
                        </div>
                        <div className="text-sm text-gray-600 truncate">{u.email}</div>
                        <div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            u.role === "provider" ? "bg-purple-50 text-purple-700 border-purple-200" :
                            u.role === "admin" ? "bg-gray-900 text-white border-gray-900" :
                            "bg-blue-50 text-blue-700 border-blue-200"
                          }`}>
                            {u.role}
                          </span>
                        </div>
                        <div className="mt-2 md:mt-0 md:text-right">
                          <button className="flex items-center justify-center md:justify-end gap-1.5 text-red-600 bg-red-50 md:bg-transparent px-4 py-2 md:px-0 md:py-0 w-full md:w-auto rounded-lg text-sm font-bold hover:text-red-800 hover:bg-red-100 md:hover:bg-transparent transition-colors ml-auto">
                            <ShieldAlert size={16} /> Suspend
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                      No users match your search.
                    </div>
                  )}
                </div>

                {maxUserPage > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 gap-4">
                    <span className="text-sm text-gray-700 font-medium">
                      Page <span className="font-bold">{userPage}</span> of <span className="font-bold">{maxUserPage}</span>
                    </span>
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <button onClick={prevUser} disabled={userPage === 1} className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors shadow-sm">Previous</button>
                      <button onClick={nextUser} disabled={userPage === maxUserPage} className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors shadow-sm">Next</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* JOB AUDITS TAB                               */}
          {/* ========================================== */}
          {activeTab === "bookings" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentBookings().length === 0 ? (
                  <div className="col-span-full py-16 text-center flex flex-col items-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Camera className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No completed jobs found on the platform yet.</p>
                  </div>
                ) : (
                  currentBookings().map((booking) => (
                    <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex justify-between items-start mb-4 gap-2">
                          <h3 className="font-bold text-gray-900 text-lg">Job #{booking.id}</h3>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                            booking.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">Customer:</span> {booking.customer_name || `User #${booking.customer_id}`}</p>
                          <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">Provider:</span> {booking.provider_name || `Provider #${booking.provider_id}`}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500 line-clamp-2 italic">"{booking.notes || "No notes provided."}"</p>
                        </div>
                      </div>

                      {booking.status === "Completed" && (
                        <button onClick={() => setAuditModal(booking)} className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-2.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                          <ImageIcon size={16} /> View Evidence
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {maxBookingPage > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white rounded-2xl shadow-sm border border-gray-200 gap-4">
                  <span className="text-sm text-gray-700 font-medium">
                    Page <span className="font-bold">{bookingPage}</span> of <span className="font-bold">{maxBookingPage}</span>
                  </span>
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <button onClick={prevBooking} disabled={bookingPage === 1} className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors shadow-sm">Previous</button>
                    <button onClick={nextBooking} disabled={bookingPage === maxBookingPage} className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors shadow-sm">Next</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Audit Modal */}
      {auditModal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all" onClick={() => setAuditModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <Camera className="text-blue-600" /> Job #{auditModal.id} Audit
              </h3>
              <button onClick={() => setAuditModal(null)} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <h4 className="font-bold text-gray-800 uppercase tracking-wider text-sm">Before Service</h4>
                </div>
                <div className="bg-gray-100 rounded-xl h-48 md:h-72 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center group relative">
                  {auditModal.before_image_url || auditModal.beforeImage ? (
                    <img src={auditModal.before_image_url || auditModal.beforeImage} alt="Before" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-gray-400 font-medium text-sm flex flex-col items-center gap-2"><ImageIcon size={24}/> No image uploaded</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <h4 className="font-bold text-gray-800 uppercase tracking-wider text-sm">After Service</h4>
                </div>
                <div className="bg-gray-100 rounded-xl h-48 md:h-72 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center group relative">
                  {auditModal.after_image_url || auditModal.afterImage ? (
                    <img src={auditModal.after_image_url || auditModal.afterImage} alt="After" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-gray-400 font-medium text-sm flex flex-col items-center gap-2"><ImageIcon size={24}/> No image uploaded</span>
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