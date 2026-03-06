import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProviderData,
  updateProfile,
  toggleAvailability,
  clearProviderMessages,
} from "../../redux/slices/providerSlice";

export default function EditProfile() {
  const dispatch = useDispatch();

  // Grab state directly from Redux
  const { profile, categories, isLoading, error, successMessage } = useSelector(
    (state) => state.provider
  );

  // Local form state
  const [formData, setFormData] = useState({
    categoryId: "",
    bio: "",
  });

  // 1. Fetch data on mount
  useEffect(() => {
    dispatch(fetchProviderData());

    // Cleanup messages when leaving the page
    return () => dispatch(clearProviderMessages());
  }, [dispatch]);

  // 2. Sync Redux profile data into local form once loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        categoryId: profile.category_id || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  // 3. Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch(clearProviderMessages()); // Clear errors when typing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  const handleToggle = () => {
    const isCurrentlyAvailable = !!profile?.is_available;
    dispatch(toggleAvailability(!isCurrentlyAvailable));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Global Alerts from Redux */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium border border-green-200">
          {successMessage}
        </div>
      )}

      {/* AVAILABILITY TOGGLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Duty Status</h3>
          <p className="text-sm text-gray-500">
            {profile?.is_available
              ? "You are visible to customers and can receive bookings."
              : "You are currently hidden from search results."}
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={!profile} // Disable if they haven't created a profile yet
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
            profile?.is_available ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              profile?.is_available ? "translate-x-9" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* PROFILE FORM CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Provider Profile
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Complete your profile so Admin can approve you for work!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-50"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About You (Bio)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={isLoading}
              rows="4"
              placeholder="Tell customers about your experience..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:bg-gray-50"
              required
            ></textarea>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-6 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white font-semibold px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-70"
            >
              {isLoading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
