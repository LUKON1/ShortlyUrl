import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import useRefreshToken from "../../utils/useRefreshToken";
import retryRequest from "../../utils/retryRequest";
import Urlslist from "../Dashboard/myurlslist";
import Notifications from "../shared/messagewindow";
import UserProfile from "../Dashboard/UserProfile";
import StatsCard from "../Dashboard/StatsCard";
import ProfileAnalyticsChart from "../Dashboard/ProfileAnalyticsChart";
import TopUrlsList from "../Dashboard/TopUrlsList";
import H1 from ".././shared/h1";
import AppLoader from "../shared/AppLoader";

function Myurlspage() {
  const API_MYURLS = "/myurls/geturls";
  const API_ANALYTICS = "/myurls/analytics";
  const API_PROFILE = "/myurls/profile";
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshToken();
  const [urls, setUrls] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [hasDashboardError, setHasDashboardError] = useState(false);
  const notificationRef = useRef();

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setHasDashboardError(false);
    try {
      await refresh();
      const results = await Promise.allSettled([
        await axiosPrivate.get(API_MYURLS),
        await axiosPrivate.get(API_PROFILE),
        await axiosPrivate.get(API_ANALYTICS),
      ]);
      const [urlsRes, profileRes, analyticsRes] = results;
      if (urlsRes.status === "fulfilled") {
        setUrls(urlsRes.value.data);
      }
      if (profileRes.status === "fulfilled") {
        setProfile(profileRes.value.data);
      }
      if (analyticsRes.status === "fulfilled") {
        setAnalytics(analyticsRes.value.data);
      }
      const hasErrors = results.some((res) => res.status === "rejected");
      if (hasErrors) {
        setHasDashboardError(true);
      }
    } catch (err) {
      setHasDashboardError(true);
    } finally {
      setIsLoading(false);
    }
  }, [axiosPrivate, refresh, API_PROFILE, API_MYURLS, API_ANALYTICS]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getMyUrls = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await retryRequest(() => axiosPrivate.get(API_MYURLS), 3, 1000);
      setUrls(response.data);
    } catch (err) {
      console.error("Failed to fetch user URLs:", err);
      notificationRef.current?.addNotification(t("myurls.loaderr"), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [axiosPrivate, API_MYURLS]);

  const updateUrl = useCallback((updatedUrl) => {
    setUrls((prevUrls) =>
      prevUrls.map((url) => (url._id === updatedUrl._id ? updatedUrl : url))
    );
  }, []);

  const removeUrl = useCallback((urlId) => {
    setUrls((prevUrls) => prevUrls.filter((url) => url._id !== urlId));
  }, []);

  return (
    <div className="flex w-full flex-col items-center px-4 pb-20">
      <Notifications ref={notificationRef} />

      <div className="w-full max-w-7xl">
        <div className="mb-8">
          <H1>{t("dashboard.title")}</H1>
        </div>

        <div className="mb-6 flex flex-row justify-between border-b border-gray-200 dark:border-slate-700">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`touch-manipulation border-b-2 px-4 py-3 text-sm font-semibold transition-colors md:text-base ${
                activeTab === "overview"
                  ? "border-sky-500 text-sky-600 dark:text-sky-400"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {t("dashboard.overview")}
            </button>
            <button
              onClick={() => setActiveTab("urls")}
              className={`touch-manipulation border-b-2 px-4 py-3 text-sm font-semibold transition-colors md:text-base ${
                activeTab === "urls"
                  ? "border-sky-500 text-sky-600 dark:text-sky-400"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {t("dashboard.myUrls")}
            </button>
          </nav>
          <p className="hidden items-center text-gray-600 md:flex dark:text-gray-400">
            {t("dashboard.subtitle")}
          </p>
        </div>

        {activeTab === "overview" &&
          (isLoading ? (
            <div className="flex items-center justify-center">
              <AppLoader />
            </div>
          ) : hasDashboardError ? (
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <div className="text-center">
                  <svg
                    className="mx-auto mb-4 h-12 w-12 text-red-500 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {t("dashboard.error.title")}
                  </h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    {t("dashboard.error.message")}
                  </p>
                  <button
                    onClick={fetchDashboardData}
                    className="touch-manipulation inline-flex items-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-600"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    {t("dashboard.error.retry")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <UserProfile profile={profile} />
              {analytics && (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                      title={t("dashboard.totalUrls")}
                      value={analytics.totalUrls}
                      icon={
                        <svg fill="currentColor" viewBox="0 0 24 24" className="h-8 w-8">
                          <path d="M10,17.55,8.23,19.27a2.47,2.47,0,0,1-3.5-3.5l4.54-4.55a2.46,2.46,0,0,1,3.39-.09l.12.1a1,1,0,0,0,1.4-1.43A2.75,2.75,0,0,0,14,9.59a4.46,4.46,0,0,0-6.09.22L3.31,14.36a4.48,4.48,0,0,0,6.33,6.33L11.37,19A1,1,0,0,0,10,17.55ZM20.69,3.31a4.49,4.49,0,0,0-6.33,0L12.63,5A1,1,0,0,0,14,6.45l1.73-1.72a2.47,2.47,0,0,1,3.5,3.5l-4.54,4.55a2.46,2.46,0,0,1-3.39.09l-.12-.1a1,1,0,0,0-1.4,1.43,2.75,2.75,0,0,0,.23.21,4.47,4.47,0,0,0,6.09-.22l4.55-4.55A4.49,4.49,0,0,0,20.69,3.31Z" />
                        </svg>
                      }
                    />
                    <StatsCard
                      title={t("dashboard.totalClicks")}
                      value={analytics.totalClicks}
                      icon={
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      }
                      subtitle={`${analytics.clicksLast7Days} ${t("dashboard.last7Days")}`}
                    />
                    <StatsCard
                      title={t("dashboard.activeUrls")}
                      value={analytics.activeUrls}
                      icon={
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      }
                    />
                    <StatsCard
                      title={t("dashboard.expiredUrls")}
                      value={analytics.expiredUrls}
                      icon={
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      }
                    />
                  </div>

                  <ProfileAnalyticsChart
                    data={analytics.chartData}
                    title={t("dashboard.activityChart")}
                  />

                  <TopUrlsList topUrls={analytics.topUrls} />
                </>
              )}
            </div>
          ))}

        {activeTab === "urls" && (
          <Urlslist
            urls={urls}
            getMyUrls={getMyUrls}
            updateUrl={updateUrl}
            removeUrl={removeUrl}
            notificationRef={notificationRef}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

export default Myurlspage;
