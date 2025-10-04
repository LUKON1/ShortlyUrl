import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";

function Logout() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { setAuth } = useContext(AuthContext);
	const handleLogout = () => {
		setAuth({});
		navigate("/");
	};
	return (
		<button
			onClick={handleLogout}
			type="button"
			className="transition-all duration-200 ease-out
         hover:bg-red-400 active:bg-red-500 bg-red-300
          shadow-md hover:shadow-lg h-12
          lg:h-16  text-1xl md:text-2xl
          p-4  rounded-md text-rose-950 font-extrabold
          flex items-center justify-center w-1/5 max-w-35 absolute top-0 right-0 mt-21 mr-2"
		>
			{t("myurls.logout")}
		</button>
	);
}
export default Logout;
