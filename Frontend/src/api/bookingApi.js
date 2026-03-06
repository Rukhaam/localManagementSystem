import api from './axiosConfig';

// Fetch all bookings for the logged-in user (Provider or Customer)
export const getMyBookingsAPI = async () => {
  const response = await api.get('/bookings');
  return response.data;
};

// Update the status of a booking (e.g., Requested -> Confirmed)
export const updateBookingStatusAPI = async (bookingId, status) => {
  const response = await api.patch(`/bookings/${bookingId}/status`, { status });
  return response.data;
};

// Complete a job with images
export const completeJobAPI = async (bookingId, formData) => {
  // We use formData here because we are uploading images (multipart/form-data)
  const response = await api.patch(`/bookings/${bookingId}/complete`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
// Add this to the bottom of bookingApi.js
export const requestBookingAPI = async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  };