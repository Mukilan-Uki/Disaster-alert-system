import axios from "axios";

const normalizeBaseUrl = (url) => (url ? url.replace(/\/+$/, "") : "");
const apiHost = normalizeBaseUrl(process.env.REACT_APP_API_BASE_URL || "");
const baseURL = apiHost ? `${apiHost}/api` : "/api";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  },
);

export default api;
