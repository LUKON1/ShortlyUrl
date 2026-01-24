import { useEffect, useRef } from "react";
import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const isRefreshing = useRef(null);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        // Проверяем на network error
        const isNetworkError =
          !error.response &&
          (error.code === "ERR_NETWORK" || error.message?.includes("Network Error"));

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          if (isRefreshing.current) {
            await isRefreshing.current;
          }

          if (!isRefreshing.current) {
            isRefreshing.current = new Promise(async (resolve, reject) => {
              try {
                const newAccessToken = await refresh();
                prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                resolve();
              } catch (refreshError) {
                // Не разлогиниваем при network error
                const isRefreshNetworkError =
                  !refreshError.response &&
                  (refreshError.code === "ERR_NETWORK" ||
                    refreshError.message?.includes("Network Error"));

                if (!isRefreshNetworkError) {
                  console.error("Refresh token failed, logging out:", refreshError);
                  setAuth({});
                  navigate("/signin");
                } else {
                  console.error("Refresh token failed due to network error:", refreshError);
                }
                reject(refreshError);
              } finally {
                isRefreshing.current = null;
              }
            });
          }

          await isRefreshing.current;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh, setAuth, navigate]);

  return axiosPrivate;
};

export default useAxiosPrivate;
