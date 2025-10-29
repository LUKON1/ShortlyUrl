import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import Urlslist from "../Dashboard/myurlslist";
import Notifications from "../shared/messagewindow";
import UserProfile from "../Dashboard/UserProfile";
import StatsCard from "../Dashboard/StatsCard";
import ProfileAnalyticsChart from "../Dashboard/ProfileAnalyticsChart";
import TopUrlsList from "../Dashboard/TopUrlsList";
import H1 from ".././shared/h1"

function Myurlspage() {
    const API_MYURLS = "/myurls/geturls";
    const API_ANALYTICS = "/myurls/analytics";
    const API_PROFILE = "/myurls/profile";
    const { t } = useTranslation();
    const axiosPrivate = useAxiosPrivate();
    const [urls, setUrls] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const notificationRef = useRef();

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const profileResponse = await axiosPrivate.get(API_PROFILE);
            setProfile(profileResponse.data);

            const urlsResponse = await axiosPrivate.get(API_MYURLS);
            setUrls(urlsResponse.data);

            const analyticsResponse = await axiosPrivate.get(API_ANALYTICS);
            setAnalytics(analyticsResponse.data);

        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            notificationRef.current?.addNotification(t("dashboard.loaderr"), 3000);
        } finally {
            setIsLoading(false);
        }
    }, [axiosPrivate, t, API_PROFILE, API_MYURLS, API_ANALYTICS]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const getMyUrls = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axiosPrivate.get(API_MYURLS);
            setUrls(response.data);
        } catch (err) {
            console.error("Failed to fetch user URLs:", err);
            notificationRef.current?.addNotification(t("myurls.loaderr"), 3000);
        } finally {
            setIsLoading(false);
        }
    }, [axiosPrivate, t, API_MYURLS]);


    return (
        <div className="flex w-full flex-col items-center px-4 pb-20">
            <Notifications ref={notificationRef} />

            <div className="w-full max-w-7xl">
                <div className="mb-8">
                    <H1>
                        {t("dashboard.title")}
                    </H1>
                </div>

                <div className="flex flex-row justify-between mb-6 border-b border-gray-200 dark:border-slate-700">
                    <nav className="flex gap-4">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`px-4 py-3 font-semibold text-sm md:text-base transition-colors border-b-2 ${
                                activeTab === "overview"
                                    ? "border-sky-500 text-sky-600 dark:text-sky-400"
                                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            }`}
                        >
                            {t("dashboard.overview")}
                        </button>
                        <button
                            onClick={() => setActiveTab("urls")}
                            className={`px-4 py-3 font-semibold text-sm md:text-base transition-colors border-b-2 ${
                                activeTab === "urls"
                                    ? "border-sky-500 text-sky-600 dark:text-sky-400"
                                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            }`}
                        >
                            {t("dashboard.myUrls")}
                        </button>
                    </nav>
                    <p className="text-gray-600 dark:text-gray-400 hidden md:flex items-center">
                        {t("dashboard.subtitle")}
                    </p>
                </div>

                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <UserProfile profile={profile} />


                        {analytics && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatsCard
                                        title={t("dashboard.totalUrls")}
                                        value={analytics.totalUrls}
                                        icon={
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13 7H7v6h6V7z" />
                                                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                                            </svg>
                                        }
                                    />
                                    <StatsCard
                                        title={t("dashboard.totalClicks")}
                                        value={analytics.totalClicks}
                                        icon={
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        }
                                        subtitle={`${analytics.clicksLast7Days} ${t("dashboard.last7Days")}`}
                                    />
                                    <StatsCard
                                        title={t("dashboard.activeUrls")}
                                        value={analytics.activeUrls}
                                        icon={
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        }
                                    />
                                    <StatsCard
                                        title={t("dashboard.expiredUrls")}
                                        value={analytics.expiredUrls}
                                        icon={
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                )}

                {activeTab === "urls" && (
                    <Urlslist
                        urls={urls}
                        getMyUrls={getMyUrls}
                        notificationRef={notificationRef}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
}

export default Myurlspage;
