import api from './axiosConfig';

// 1. Update the logged-in Provider's profile
export const updateProviderProfileAPI = async (profileData) => {
  // Assuming your backend will have a PUT route like /api/users/profile or /api/providers/profile
  const response = await api.put('/users/profile', profileData); 
  return response.data;
};