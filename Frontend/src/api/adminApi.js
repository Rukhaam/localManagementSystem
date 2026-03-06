import api from './axiosConfig';

// Fetch all providers (including those waiting for approval)
export const getAllProvidersAdminAPI = async () => {
    const response = await api.get('/providers/admin/all');
    return response.data;
  };

// Approve or Reject a provider
export const approveProviderAPI = async (profileId, isApproved) => {
  const response = await api.patch(`/providers/${profileId}/approve`, { isApproved });
  return response.data;
};

// Create a new category
export const createCategoryAPI = async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  };

  export const deleteCategoryAPI = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  };