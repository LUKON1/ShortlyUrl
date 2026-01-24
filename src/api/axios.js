import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Глобальный interceptor для обработки network errors
let offlineModalShown = false;

const showOfflineModalIfNeeded = () => {
  if (!offlineModalShown && window.offlineContext) {
    offlineModalShown = true;
    window.offlineContext.showOfflineModal();
  }
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Проверяем на network error
    const isNetworkError =
      !error.response && (error.code === "ERR_NETWORK" || error.message?.includes("Network Error"));

    if (isNetworkError) {
      showOfflineModalIfNeeded();
    }

    return Promise.reject(error);
  }
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    // Проверяем на network error
    const isNetworkError =
      !error.response && (error.code === "ERR_NETWORK" || error.message?.includes("Network Error"));

    if (isNetworkError) {
      showOfflineModalIfNeeded();
    }

    return Promise.reject(error);
  }
);
