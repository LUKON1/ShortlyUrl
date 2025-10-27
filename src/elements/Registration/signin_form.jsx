import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "../shared/messagewindow";
import Registrsubmit from "../shared/registr_submit";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";
import useAuth from "../../utils/useAuth";

function Signinform() {
  const API_SIGNIN = "/user/login";
  const { setAuth } = useAuth();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const inputRef = useRef();
  const navigate = useNavigate();
  const notificationRef = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        API_SIGNIN,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      const accessToken = response?.data?.accessToken;
      const userId = response?.data?.userId;
      setAuth({ user, pwd, accessToken, userId });
      setUser("");
      setPwd("");
      navigate("/profile");
    } catch (err) {
      notificationRef.current?.addNotification(
        t("registration.incorrectpwdus"),
        3000
      );
    }
  };

  return (
    <>
      <Notifications ref={notificationRef} />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col transition-all duration-200 ease-out gap-5 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700"
      >
        <input
          ref={inputRef}
          className="transition-all duration-200 ease-out text-center
               p-2 h-16 lg:h-20  text-1xl md:text-2xl lg:text-3xl border-2
                rounded-lg max-w-5xl border-sky-400 dark:border-sky-500 w-3xs md:w-[55vw]
                 lg:w-[70vw] bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100
                 focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-sm"
          type="text"
          placeholder={t("registration.loginPlaceholder")}
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
          }}
          required
        />
        <input
          className="transition-all duration-200 ease-out text-center
               p-2 h-16 lg:h-20  text-1xl md:text-2xl lg:text-3xl border-2
                rounded-lg max-w-5xl border-sky-400 dark:border-sky-500 w-3xs md:w-[55vw]
                 lg:w-[70vw] bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100
                 focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-sm"
          type="password"
          placeholder={t("registration.passwordPlaceholder")}
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
          minLength={5}
        />
        <Registrsubmit>{t("registration.submit")}</Registrsubmit>
        <Link className="underline text-lg hover:text-sky-600 dark:hover:text-sky-400 text-gray-700 dark:text-gray-300 transition-colors" to="/registration">{t("registration.donthaveacc")}</Link>
      </form>
    </>
  );
}
export default Signinform;
