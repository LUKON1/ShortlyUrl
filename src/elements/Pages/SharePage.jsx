import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
            to="/"
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
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <H1>{t("shared.title")}</H1>
          </div>

          {urlData && (
            <UrlCard
              mode="share"
              urlData={urlData}
              t={t}
              onCopy={() => {
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_BASE_URL}/${urlData.shortCode}`
                );
                notificationRef.current?.addNotification(t("homepage.copied"), 2000);
              }}
            />
          )}

          {/* Chart */}
          <div
            className="relative z-10 mt-2 mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-lg hover:shadow-xl sm:p-6 dark:border-slate-700 dark:bg-slate-800"
            style={{ transition: "var(--transition-bg)" }}
          >
            <h3 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
              {t("shared.clickHistory")}
            </h3>
            <ResponsiveContainer width="100%" height={300} minWidth={200} minHeight={200}>
              <LineChart
                data={urlData.chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 30,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-300 dark:stroke-gray-600"
                />
                <XAxis dataKey="date" className="fill-gray-700 dark:fill-gray-300" />
                <YAxis className="fill-gray-700 dark:fill-gray-300" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(30 41 59)",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Clicks"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default SharePage;
