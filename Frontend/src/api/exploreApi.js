import api from './axiosConfig';

// Fetch all available categories
export const getCategoriesAPI = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Fetch all approved & available providers (Optional: filter by categoryId)
export const getActiveProvidersAPI = async (categoryId = '') => {
  const url = categoryId ? `/providers?categoryId=${categoryId}` : '/providers';
  const response = await api.get(url);
  return response.data;
};