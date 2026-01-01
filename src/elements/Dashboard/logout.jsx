import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import useAxiosPrivate from "../../utils/useAxiosPrivate";

function Logout() {
  const API_LOGOUT = "/user/logout";
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const handleLogout = async () => {
    try {
      await axiosPrivate.post(API_LOGOUT, {});
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAuth({});
      navigate("/");
    }
  };
  return (
    <button
      onClick={handleLogout}
      type="button"
      className="touch-manipulation flex h-8 w-8 items-center justify-center rounded-md bg-red-300 p-1.5 text-sm font-bold text-white shadow-md transition-all duration-200 ease-out hover:bg-red-400 hover:shadow-lg active:bg-red-500 sm:h-10 sm:w-10 sm:text-base md:h-14 md:w-14 dark:bg-red-500 dark:text-slate-900 dark:hover:bg-red-600 dark:active:bg-red-700"
      title={t("myurls.logout")}
    >
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M15 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H15M8 8L4 12M4 12L8 16M4 12L16 12"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
export default Logout;
