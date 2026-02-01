import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/formatDate";
import Logout from "./logout";
import DeleteProfile from "./deleteProfile";

function UserProfile({ profile }) {
  const { t } = useTranslation();

  if (!profile) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-sky-400 to-blue-600 text-3xl font-bold text-white shadow-lg dark:from-sky-500 dark:to-blue-700">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {profile.username}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("dashboard.memberSince")} {formatDate(profile.accountCreated)}
          </p>
        </div>
        <DeleteProfile />
        <Logout />
      </div>
    </div>
  );
}

export default UserProfile;
