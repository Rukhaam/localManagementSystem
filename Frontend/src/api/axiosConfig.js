import axios from 'axios';

const api = axios.create({
  // Vite uses import.meta.env instead of process.env
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // THIS IS THE MOST IMPORTANT LINE IN YOUR FRONTEND!
  // It tells the browser to automatically attach your HTTP-Only cookies to every request.
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;