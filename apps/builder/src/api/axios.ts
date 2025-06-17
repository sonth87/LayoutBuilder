import axios from "axios";

const axiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_BE_SERVER || "http://localhost:6789") + "/api",
  timeout: 10000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token or other headers here
    // config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    return Promise.reject(error);
  },
);

export default axiosInstance;
