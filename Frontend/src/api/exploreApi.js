import api from './axiosConfig';

export const getCategoriesAPI = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getActiveProvidersAPI = async (categoryId = '') => {
  const url = categoryId ? `/providers?categoryId=${categoryId}` : '/providers';
  const response = await api.get(url);
  return response.data;
};