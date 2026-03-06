import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProviders, toggleProviderApproval, clearAdminMessages } from "../../redux/slices/adminSlice";

export default function ApproveProviders() {
  const dispatch = useDispatch();
  const { providers, isLoading, error, successMessage } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllProviders());
    return () => dispatch(clearAdminMessages());
  }, [dispatch]);

  const handleApproval = (profileId, status) => {
    dispatch(toggleProviderApproval({ profileId, isApproved: status }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Provider Approvals</h1>
      
      {successMessage && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">{successMessage}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase">Provider</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase">Bio</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {providers.map((p) => (
              <tr key={p.profile_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{p.bio}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${p.is_approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {!p.is_approved ? (
                    <button onClick={() => handleApproval(p.profile_id, true)} className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded hover:bg-blue-700">Approve</button>
                  ) : (
                    <button onClick={() => handleApproval(p.profile_id, false)} className="text-red-600 text-xs font-bold px-4 py-2 hover:underline">Revoke</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}