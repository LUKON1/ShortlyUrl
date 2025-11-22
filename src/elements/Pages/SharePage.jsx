import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

function SharePage() {
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
          <h2 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">Error</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">{error}</p>
          <Link
            to="/"
            className="rounded-lg bg-sky-500 px-6 py-2 text-white transition-colors hover:bg-sky-600"
          >
            Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-rose-50 px-4 pb-20 dark:bg-slate-900">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <H1>Shared URL</H1>
        </div>

        {/* URL Item Display */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex max-w-[64%] flex-col">
              <div className="flex flex-row items-center gap-4">
                <p className="text-base font-bold text-sky-400 transition-colors select-all hover:text-sky-600 sm:text-lg md:text-xl dark:text-sky-500 dark:hover:text-sky-300">
                  {`${import.meta.env.VITE_BASE_URL}/${urlData.shortCode}`}
                </p>
                {/* Visit button */}
                <button
                  onClick={() => {
                    window.location.href = urlData.url;
                  }}
                  className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-xl border border-green-600 bg-green-500 p-1 hover:bg-green-600 sm:h-5 sm:w-5 md:h-6 md:w-6 dark:bg-green-700 dark:hover:bg-green-600"
                  title="Visit Site"
                >
                  <svg fill="#FFFFFF" viewBox="0 0 15 15">
                    <path d="M8.29289 2.29289C8.68342 1.90237 9.31658 1.90237 9.70711 2.29289L14.2071 6.79289C14.5976 7.18342 14.5976 7.81658 14.2071 8.20711L9.70711 12.7071C9.31658 13.0976 8.68342 13.0976 8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L11 8.5H1.5C0.947715 8.5 0.5 8.05228 0.5 7.5C0.5 6.94772 0.947715 6.5 1.5 6.5H11L8.29289 3.70711C7.90237 3.31658 7.90237 2.68342 8.29289 2.29289Z" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 truncate text-sm text-gray-600 sm:text-base md:text-lg dark:text-gray-400">
                {urlData.url}
              </p>
            </div>
            <div className="flex flex-row-reverse items-center gap-1.5">
              {/* Download QR Button */}
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-sky-500 bg-sky-400 hover:bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:bg-sky-700 dark:hover:bg-sky-600"
                onClick={() => {
                  const urlFullDomain = new URL(urlData.url);
                  const urlMainDomain = urlFullDomain.hostname;
                  const domainParts = urlMainDomain.split(".");
                  const baseDomain = domainParts.slice(-2).join(".");
                  const link = document.createElement("a");
                  link.href = urlData.qrCodeDataUrl;
                  link.download = `${baseDomain}-QRcode.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                title="Download QR"
              >
                <svg viewBox="0 0 24 24" fill="none" className="p-1">
                  <path
                    d="M9,10H4A1,1,0,0,1,3,9V4A1,1,0,0,1,4,3H9a1,1,0,0,1,1,1V9A1,1,0,0,1,9,10ZM21,9V4a1,1,0,0,0-1-1H15a1,1,0,0,0-1,1V9a1,1,0,0,0,1,1h5A1,1,0,0,0,21,9ZM10,20V15a1,1,0,0,0-1-1H4a1,1,0,0,0-1,1v5a1,1,0,0,0,1,1H9A1,1,0,0,0,10,20Z"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21,14v5a2,2,0,0,1-2,2H14"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17,17H14V14h3ZM10,9V4A1,1,0,0,0,9,3H4A1,1,0,0,0,3,4V9a1,1,0,0,0,1,1H9A1,1,0,0,0,10,9Zm10,1H15a1,1,0,0,1-1-1V4a1,1,0,0,1,1-1h5a1,1,0,0,1,1,1V9A1,1,0,0,1,20,10ZM9,21H4a1,1,0,0,1-1-1V15a1,1,0,0,1,1-1H9a1,1,0,0,1,1,1v5A1,1,0,0,1,9,21Z"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {/* Copy button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${import.meta.env.VITE_BASE_URL}/${urlData.shortCode}`
                  );
                  alert("Copied!");
                }}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-sky-500 bg-sky-400 hover:bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:bg-sky-700 dark:hover:bg-sky-600"
                title="Copy"
              >
                <svg fill="#FFFFFF" viewBox="0 0 24 24" className="p-1">
                  <path d="M21,8.94a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19.32.32,0,0,0-.09,0A.88.88,0,0,0,14.05,2H10A3,3,0,0,0,7,5V6H6A3,3,0,0,0,3,9V19a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V18h1a3,3,0,0,0,3-3V9S21,9,21,8.94ZM15,5.41,17.59,8H16a1,1,0,0,1-1-1ZM15,19a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V9A1,1,0,0,1,6,8H7v7a3,3,0,0,0,3,3h5Zm4-4a1,1,0,0,1-1,1H10a1,1,0,0,1-1-1V5a1,1,0,0,1,1-1h3V7a3,3,0,0,0,3,3h3Z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-2 self-end rounded-lg border px-4 py-2 shadow-md transition-colors dark:text-white ${
                dayjs(urlData.expiredAt).isAfter(dayjs())
                  ? "border-green-600 bg-green-500 dark:border-green-600 dark:bg-green-700"
                  : "border-red-600 bg-red-500 dark:border-red-600 dark:bg-red-500"
              } `}
            >
              <svg className="h-7 w-7" viewBox="0 0 20 20" fill="white">
                {dayjs(urlData.expiredAt).isAfter(dayjs()) ? (
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 5.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              <div>
                <p className="text-lg font-semibold text-white sm:text-xl md:text-2xl">
                  {dayjs(urlData.expiredAt).isAfter(dayjs()) ? "Active" : "Expired"}
                </p>
                <span className="text-base text-white sm:text-lg md:text-xl">
                  {formatDate(urlData.createdAt)} — {formatDate(urlData.expiredAt)}
                </span>
              </div>
            </div>
            <div
              className="flex h-7 w-auto flex-row items-center gap-1 self-end rounded-xl border border-sky-500 bg-sky-400 px-2 sm:h-9 md:h-12 dark:bg-sky-700"
              title="Clicks"
            >
              <svg
                fill="#FFFFFF"
                className="h-7 w-7 p-1 sm:h-9 sm:w-9 md:h-12 md:w-12"
                viewBox="0 0 48 48"
              >
                <rect width={48} height={48} fill="#FFFFFF" fillOpacity={0.01} />
                <path
                  d="M24 4V12"
                  stroke="#FFFFFF"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M22 22L42 26L36 30L42 36L36 42L30 36L26 42L22 22Z"
                  fill="#FFFFFF"
                  stroke="#FFFFFF"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M38.1421 9.85795L32.4853 15.5148"
                  stroke="#FFFFFF"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.85787 38.1421L15.5147 32.4852"
                  stroke="#FFFFFF"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 24H12"
                  stroke="#FFFFFF"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.85783 9.85787L15.5147 15.5147"
                  stroke="#FFFFFF"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-lg font-extrabold text-white sm:text-xl md:text-2xl">
                {urlData.clicks}
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
            Click History
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
