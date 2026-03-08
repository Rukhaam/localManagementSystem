import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProviderData, updateProfile, toggleAvailability, clearProviderMessages } from "../../redux/slices/providerSlice";
import { useToast } from "../../hooks/toastHook";
import { ShieldCheck, ToggleRight } from "lucide-react";

export default function EditProfile() {
  const dispatch = useDispatch();
  const { showSuccess, showError, showLoading, dismissToast } = useToast();

  const { profile, categories, isLoading } = useSelector((state) => state.provider);

  const [formData, setFormData] = useState({
    categoryId: "",
    bio: "",
  });

  useEffect(() => {
    dispatch(fetchProviderData());
    return () => dispatch(clearProviderMessages());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        categoryId: profile.category_id || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingId = showLoading("Saving profile...");
    
    const res = await dispatch(updateProfile(formData)).unwrap().catch(() => ({error: true}));
    dismissToast(loadingId);

    if (!res.error) {
      showSuccess("Profile updated successfully!");
    } else {
      showError("Failed to update profile.");
    }
  };

  const handleToggle = async () => {
    const isCurrentlyAvailable = !!profile?.is_available;
    const loadingId = showLoading("Updating status...");
    
    const res = await dispatch(toggleAvailability(!isCurrentlyAvailable)).unwrap().catch(() => ({error: true}));
    dismissToast(loadingId);

    if (!res.error) {
      showSuccess(`You are now ${!isCurrentlyAvailable ? 'Online ✅' : 'Offline 🛑'}`);
    } else {
      showError("Failed to update duty status.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-4 pb-12">
      
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Provider Profile</h1>
        <p className="text-gray-500 mt-2 text-lg">Manage your public information and duty status.</p>
      </div>

      {/* AVAILABILITY TOGGLE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex items-center justify-between relative overflow-hidden">
        {/* Glow effect based on status */}
        <div className={`absolute left-0 top-0 bottom-0 w-2 transition-colors duration-500 ${profile?.is_available ? "bg-green-500" : "bg-gray-300"}`}></div>
        
        <div className="pl-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ToggleRight className={profile?.is_available ? "text-green-500" : "text-gray-400"} /> Duty Status
          </h3>
          <p className="text-sm font-medium text-gray-500 mt-1">
            {profile?.is_available
              ? "You are visible to customers and can receive booking requests."
              : "You are currently hidden from search results."}
          </p>
        </div>

        <button
          onClick={handleToggle}
          disabled={!profile}
          className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 ${
            profile?.is_available ? "bg-green-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
              profile?.is_available ? "translate-x-11" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* PROFILE FORM CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
        <div className="mb-8 border-b border-gray-100 pb-6 flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Details
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Complete your profile so Admin can approve you for work.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Primary Service Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-all disabled:opacity-60 font-medium text-gray-700"
              required
            >
              <option value="" disabled>Select your specialty...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              About You (Public Bio)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={isLoading}
              rows="5"
              placeholder="Tell customers about your experience, qualifications, and why they should hire you..."
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50 focus:bg-white transition-all disabled:opacity-60 text-sm leading-relaxed"
              required
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto bg-gray-900 text-white font-bold px-10 py-3.5 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {isLoading ? "Saving Profile..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}