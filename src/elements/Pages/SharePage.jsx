import React, { useState, useEffect } from "react";
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

function SharePage() {
  const { t } = useTranslation();
  const { shortCode } = useParams();
  const [urlData, setUrlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrlData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/share/${shortCode}`);
        if (!response.ok) {
          throw new Error("Failed to fetch URL data");
        }
        const data = await response.json();
        setUrlData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (shortCode) {
      fetchUrlData();
    }
  }, [shortCode]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-rose-50 dark:bg-slate-900">
        <AppLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-rose-50 dark:bg-slate-900">
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
    <div className="flex min-h-screen w-full flex-col items-center bg-rose-50 px-4 pb-20 dark:bg-slate-900">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <H1>{t("shared.title")}</H1>
        </div>

        <UrlCard
          mode="share"
          urlData={urlData}
          t={t}
          onCopy={() => {
            navigator.clipboard.writeText(`${import.meta.env.VITE_BASE_URL}/${urlData.shortCode}`);
            alert(t("homepage.copied"));
          }}
        />

        {/* Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800">
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
  );
}

export default SharePage;
