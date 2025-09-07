import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Ensure all requests go to the correct backend route
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
