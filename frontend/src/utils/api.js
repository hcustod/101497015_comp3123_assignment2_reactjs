import axios from 'axios';

// Docker = REACT_APP_API_BASE_URL will be set (still port 5001)
// locally = localhost:5001
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api/v1';

export const FILE_BASE_URL =
  process.env.REACT_APP_FILE_BASE_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
