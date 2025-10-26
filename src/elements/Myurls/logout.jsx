import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import useAxiosPrivate from "../../utils/useAxiosPrivate";

function Logout() {
	const API_LOGOUT = "/user/logout"
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
			className="transition-all duration-200 ease-out
         hover:bg-red-400 dark:hover:bg-red-600 active:bg-red-500 dark:active:bg-red-700 bg-red-300 dark:bg-red-500
          shadow-lg hover:shadow-xl h-12
          lg:h-16  text-1xl md:text-2xl
          p-4  rounded-lg text-white dark:text-slate-900 font-extrabold
          flex items-center justify-center w-1/5 max-w-35 absolute top-0 right-0 mt-21 mr-2"
		>
			{t("myurls.logout")}
		</button>
	);
}
export default Logout;
