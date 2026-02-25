import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { CLIENT_ROUTES } from "../../utils/clientRoutes.js";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";
import AnalyticsDisplay from "../Dashboard/AnalyticsDisplay";
import AppLoader from "../shared/AppLoader";
import H1 from "../shared/h1";
import UrlCard from "../shared/UrlCard";
import Notifications from "../shared/messagewindow";
import axios from "../../api/axios";

function SharePage() {
  const { t } = useTranslation();
  const { shareId } = useParams();
  const [urlData, setUrlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notificationRef = useRef();

  useEffect(() => {
    const fetchUrlData = async () => {
      try {
        console.log("SharePage: Fetching data for shareId:", shareId);
        setLoading(true);
        setError(null);

        const response = await axios.get(`/share/${shareId}`);
        console.log("SharePage: Response received:", response);

        setUrlData(response.data);
        console.log("SharePage: Data set:", response.data);
      } catch (err) {
        console.error("SharePage: Error in fetchUrlData:", err);
        if (err.response) {
          // Сервер ответил с кодом ошибки
          console.error("SharePage: Server error:", err.response.status, err.response.data);
          setError(
            `Server error: ${err.response.status} - ${err.response.data.error || err.response.data}`
          );
        } else if (err.request) {
          // Запрос был сделан, но ответа нет
          console.error("SharePage: No response received:", err.request);
          setError("Network error: No response from server");
        } else {
          // Что-то пошло не так при настройке запроса
          console.error("SharePage: Request setup error:", err.message);
          setError(`Request error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      console.log("SharePage: shareId found, calling fetchUrlData");
      fetchUrlData();
    } else {
      console.log("SharePage: No shareId found in params");
      setLoading(false);
      setError("No share ID provided");
    }
  }, [shareId]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-white dark:bg-slate-900">
        <AppLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">
            {t("shared.error")}
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">{error}</p>
          <Link
            to={CLIENT_ROUTES.HOME}
            className="rounded-lg bg-sky-500 px-6 py-2 text-white transition-colors hover:bg-sky-600"
          >
            {t("shared.homepage")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Notifications ref={notificationRef} />
      <div className="flex min-h-screen w-full flex-col items-center px-4 pb-20">
        <div className="w-full max-w-7xl">
          <div className="mb-8">
            <H1>{t("shared.title")}</H1>
          </div>

          {urlData && (
            <>
              <UrlCard
                mode="share"
                urlData={urlData}
                t={t}
                onCopy={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/${urlData.shortCode}`);
                  notificationRef.current?.addNotification(t("homepage.copied"), 2000);
                }}
              />

              {/* Chart & Analytics */}
              <div className="relative z-10 mt-2 mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-transform hover:shadow-xl sm:p-6 dark:border-slate-700 dark:bg-slate-800">
                <AnalyticsDisplay
                  chartData={urlData.chartData}
                  analyticsData={urlData}
                  urlId={shareId}
                  t={t}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SharePage;
