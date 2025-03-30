import axios from "axios";

// Base URL for Django API
const API_BASE_URL = "http://127.0.0.1:8000/api"; 

// Get tokens from localStorage
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Debugging: Log API requests
console.log("API Request Base URL:", API_BASE_URL);

// Request Interceptor: Attach Authorization Header
api.interceptors.request.use(
  async (config) => {
    let accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Refresh Token if Access Token Expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Request a new access token using the refresh token
        const response = await api.post("auth/token/refresh/", {
          refresh: refreshToken,
        });

        // Store the new access token
        localStorage.setItem("accessToken", response.data.access);
        api.defaults.headers.Authorization = `Bearer ${response.data.access}`;

        // Retry original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token invalid. Logging out...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
