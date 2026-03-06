import api from './axiosConfig';

// 1. Register (Returns success message, does NOT log user in yet)
export const registerUserAPI = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// 2. Verify OTP (Logs user in, returns user object & sets cookie)
export const verifyOtpAPI = async (data) => {
  const response = await api.post('/auth/verify-otp', data);
  return response.data;
};

// 3. Login (Logs user in, returns user object & sets cookie)
export const loginUserAPI = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// 4. Logout (Clears cookie on backend)
export const logoutUserAPI = async () => {
  const response = await api.get('/auth/logout');
  return response.data;
};

// 5. Forgot Password
export const forgotPasswordAPI = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};
export const checkAuthAPI = async () => {
    const response = await api.get('/auth/me');
    return response.data;
  };