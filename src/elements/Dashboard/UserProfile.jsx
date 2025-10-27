import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/formatDate";

function UserProfile({ profile }) {
  const { t } = useTranslation();

  if (!profile) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 dark:from-sky-500 dark:to-blue-700 text-white text-3xl font-bold shadow-lg">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {profile.username}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("dashboard.memberSince")} {formatDate(profile.accountCreated)}
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {t("dashboard.totalUrls")}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {profile.totalUrls}
          </p>
        </div>
        <div className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {t("dashboard.totalClicks")}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {profile.totalClicks}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
