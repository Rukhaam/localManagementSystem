import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import usePagination from "../../hooks/usePagination"; 
import { fetchAllProviders, toggleProviderApproval, clearAdminMessages } from "../../redux/slices/adminSlice";

export default function ApproveProviders() {
  const dispatch = useDispatch();
  const { providers, isLoading, error, successMessage } = useSelector((state) => state.admin);

  useEffect(() => {
    if (providers.length === 0) dispatch(fetchAllProviders());
    return () => dispatch(clearAdminMessages());
  }, [dispatch, providers.length]);

  const handleApproval = (profileId, status) => {
    dispatch(toggleProviderApproval({ profileId, isApproved: status }));
  };

  // 🌟 PAGINATION HOOK (5 per page is usually better than 1 for this view!)
  const { next, prev, currentData, currentPage, maxPage } = usePagination(providers, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Provider Approvals</h1>
        <p className="text-gray-500 mt-2">Review and manage professional service accounts.</p>
      </div>
      
      {/* Global Alerts */}
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-200 shadow-sm">{error}</div>}
      {successMessage && <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-200 shadow-sm">{successMessage}</div>}

      {/* 🌟 REPLACED HTML TABLE WITH RESPONSIVE CSS GRID */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Desktop Header - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-4 gap-6 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div>Provider</div>
          <div>Bio</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* List Body */}
        <div className="divide-y divide-gray-100">
          {isLoading && providers.length === 0 ? (
            <div className="px-6 py-16 text-center text-blue-600 font-bold animate-pulse">
              Loading providers...
            </div>
          ) : currentData().length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-500 bg-gray-50">
              <div className="text-4xl mb-3">📁</div>
              No providers applied yet.
            </div>
          ) : (
            // 🌟 MAPPED PAGINATED PROVIDERS
            currentData().map((p) => (
              <div key={p.profile_id} className="flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-6 md:items-center px-6 py-6 hover:bg-gray-50 transition-colors">
                
                {/* Provider Info */}
                <div>
                  <div className="font-bold text-gray-900 text-lg md:text-base">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.email}</div>
                </div>

                {/* Bio (Includes Mobile Label) */}
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider md:hidden block mb-1">Biography</span>
                  <p className="text-sm text-gray-600 line-clamp-3 md:line-clamp-2">{p.bio}</p>
                </div>

                {/* Status (Includes Mobile Label) */}
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider md:hidden block mb-2">Account Status</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${p.is_approved ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                    {p.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 md:mt-0 md:text-right flex items-center">
                  {!p.is_approved ? (
                    <button 
                      onClick={() => handleApproval(p.profile_id, true)} 
                      disabled={isLoading} 
                      className="w-full md:w-auto bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm hover:shadow"
                    >
                      Approve Access
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleApproval(p.profile_id, false)} 
                      disabled={isLoading} 
                      className="w-full md:w-auto text-red-600 bg-red-50 border border-red-100 text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      Revoke Access
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
        
        {/* 🌟 PROVIDERS PAGINATION CONTROLS */}
        {maxPage > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 bg-gray-50 border-t border-gray-100 gap-4">
            <span className="text-sm text-gray-600 font-medium">Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{maxPage}</span></span>
            <div className="flex space-x-3 w-full sm:w-auto">
              <button 
                onClick={prev} 
                disabled={currentPage === 1} 
                className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors shadow-sm"
              >
                Previous
              </button>
              <button 
                onClick={next} 
                disabled={currentPage === maxPage} 
                className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}