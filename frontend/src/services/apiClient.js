import axios from "axios";

const isBrowser = typeof window !== "undefined";
const isLocalHost =
  isBrowser && ["localhost", "127.0.0.1"].includes(window.location.hostname);
const fallbackBaseURL = isLocalHost
  ? "http://localhost:3000"
  : "https://opportunity-portal-2.onrender.com";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || fallbackBaseURL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

export const getErrorMessage = (error, fallback = "Something went wrong.") => {
  return error?.response?.data?.message || fallback;
};

export default apiClient;
