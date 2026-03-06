import { useState, useEffect } from "react";
import api from "../../api/axiosConfig"; 

export default function EditProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form State
  const [formData, setFormData] = useState({
    categoryId: "",
    bio: "",
  });
  
  // Availability State
  const [isAvailable, setIsAvailable] = useState(false);

  // 1. FETCH PROFILE ON LOAD
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/providers/profile');
        if (response.data.profile) {
          setFormData({
            categoryId: response.data.profile.category_id,
            bio: response.data.profile.bio
          });
          // Assuming your DB returns 1/0 for booleans
          setIsAvailable(!!response.data.profile.is_available); 
        }
      } catch (error) {
        console.error("Failed to fetch profile");
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. HANDLE FORM INPUTS
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. SAVE PROFILE (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await api.post('/providers/profile', formData);
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to update profile." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 4. TOGGLE AVAILABILITY (PATCH)
  const handleToggle = async () => {
    try {
      const newStatus = !isAvailable;
      const response = await api.patch('/providers/availability', { isAvailable: newStatus });
      setIsAvailable(newStatus);
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to toggle availability." });
    }
  };

  if (isFetching) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* ========================================== */}
      {/* TOP CARD: AVAILABILITY TOGGLE              */}
      {/* ========================================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Duty Status</h3>
          <p className="text-sm text-gray-500">
            {isAvailable 
              ? "You are visible to customers and can receive bookings." 
              : "You are currently hidden from search results."}
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isAvailable ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              isAvailable ? "translate-x-9" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* ========================================== */}
      {/* BOTTOM CARD: PROFILE FORM                  */}
      {/* ========================================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Edit Provider Profile</h2>
          <p className="text-gray-500 text-sm mt-1">
            Complete your profile so Admin can approve you for work!
          </p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              required
            >
              <option value="" disabled>Select a category</option>
              
              {/* CHANGE THESE VALUES TO MATCH YOUR REAL MYSQL IDs! */}
              <option value="1">Plumbing</option>
              <option value="2">Electrical</option>
              <option value="3"> HomeCleaning</option>
              
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About You (Bio)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
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