import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyBookings, updateBookingStatus, completeJob, clearBookingMessages } from "../../redux/slices/bookingSlice";

export default function ManageJobs() {
  const dispatch = useDispatch();
  const { items: bookings, isLoading, error, successMessage } = useSelector((state) => state.bookings);
  
  // UI State
  const [activeTab, setActiveTab] = useState("requests"); 
  const [completingJobId, setCompletingJobId] = useState(null); 
  const [files, setFiles] = useState({ beforeImage: null, afterImage: null });
  const [uploadError, setUploadError] = useState(""); // 🌟 New state for validation errors

  useEffect(() => {
    dispatch(fetchMyBookings());
    return () => dispatch(clearBookingMessages());
  }, [dispatch]);

  const requestedJobs = bookings.filter(b => b.status === "Requested");
  const activeJobs = bookings.filter(b => ["Confirmed", "In-progress"].includes(b.status));
  const historyJobs = bookings.filter(b => ["Completed", "Cancelled"].includes(b.status));

  const currentJobs = 
    activeTab === "requests" ? requestedJobs : 
    activeTab === "active" ? activeJobs : historyJobs;

  // Handlers
  const handleStatusChange = (bookingId, status) => {
    dispatch(updateBookingStatus({ bookingId, status }));
  };

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    setUploadError(""); // Clear previous errors

    // 🌟 FRONTEND VALIDATION: Ensure BOTH images are provided
    if (!files.beforeImage || !files.afterImage) {
      setUploadError("Please upload both a Before and After image to complete the job.");
      return;
    }

    const formData = new FormData();
    formData.append("beforeImage", files.beforeImage);
    formData.append("afterImage", files.afterImage);
    
    dispatch(completeJob({ bookingId: completingJobId, formData })).then((res) => {
       if (!res.error) {
         setCompletingJobId(null); 
         setFiles({ beforeImage: null, afterImage: null });
       }
    });
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

  if (isLoading && bookings.length === 0) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading jobs...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Manage Jobs</h1>
        <p className="text-gray-500 mt-2">Review requests, update statuses, and complete your work.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">{error}</div>}
      {successMessage && <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium border border-green-200">{successMessage}</div>}

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        {['requests', 'active', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-6 font-medium text-sm transition-colors border-b-2 ${
              activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {tab === 'requests' ? requestedJobs.length : tab === 'active' ? activeJobs.length : historyJobs.length}
            </span>
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {currentJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
            No jobs found in this category.
          </div>
        ) : (
          currentJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Job Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-bold text-gray-800">Booking #{job.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    job.status === 'Requested' ? 'bg-blue-100 text-blue-700' :
                    job.status === 'Confirmed' ? 'bg-amber-100 text-amber-700' :
                    job.status === 'In-progress' ? 'bg-purple-100 text-purple-700' :
                    job.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {job.status}
                  </span>
                </div>
                
                {/* 🌟 APPLIED FIX: Using || for snake_case */}
                <p className="text-sm text-gray-600"><strong>Date:</strong> {formatDate(job.scheduledDate || job.scheduled_date)}</p>
                <p className="text-sm text-gray-600"><strong>Address:</strong> {job.address}</p>
                {job.notes && <p className="text-sm text-gray-600"><strong>Notes:</strong> {job.notes}</p>}
              </div>

              {/* Action Buttons based on State Machine */}
              <div className="flex flex-col space-y-2 md:w-48 shrink-0">
                {job.status === "Requested" && (
                  <>
                    <button onClick={() => handleStatusChange(job.id, "Confirmed")} disabled={isLoading} className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">Accept Job</button>
                    <button onClick={() => handleStatusChange(job.id, "Cancelled")} disabled={isLoading} className="w-full bg-gray-100 text-red-600 text-sm font-semibold py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors">Decline</button>
                  </>
                )}
                {job.status === "Confirmed" && (
                  <button onClick={() => handleStatusChange(job.id, "In-progress")} disabled={isLoading} className="w-full bg-purple-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors">Start Job (In-Progress)</button>
                )}
                {job.status === "In-progress" && (
                  <button onClick={() => { setCompletingJobId(job.id); setUploadError(""); }} className="w-full bg-green-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors">Complete & Upload Photos</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================== */}
      {/* COMPLETION MODAL WITH IMAGE UPLOADS        */}
      {/* ========================================== */}
      {completingJobId && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
          onClick={() => { setCompletingJobId(null); setUploadError(""); }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">Complete Job #{completingJobId}</h3>
            <p className="text-sm text-gray-500 mb-4">Upload before and after photos of your work to complete this booking.</p>
            
            {/* 🌟 Display validation error if they try to submit without images */}
            {uploadError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleCompleteSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Before Image <span className="text-red-500">*</span></label>
                <input required type="file" accept="image/*" onChange={(e) => setFiles({...files, beforeImage: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">After Image <span className="text-red-500">*</span></label>
                <input required type="file" accept="image/*" onChange={(e) => setFiles({...files, afterImage: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-colors cursor-pointer" />
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => { setCompletingJobId(null); setUploadError(""); }} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                  {isLoading ? "Uploading..." : "Submit Completion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}