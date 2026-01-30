import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "../shared/messagewindow";
import Registrsubmit from "../shared/registr_submit";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";
import useAuth from "../../utils/useAuth";
import { CLIENT_ROUTES } from "../../utils/clientRoutes.js";
import PasswordInput from "../shared/PasswordInput";

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
      const response = await axios.post(API_SIGNIN, JSON.stringify({ user, pwd }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const accessToken = response?.data?.accessToken;
      const userId = response?.data?.userId;
      setAuth({ user, pwd, accessToken, userId });
      setUser("");
      setPwd("");
      navigate(CLIENT_ROUTES.PROFILE);
    } catch (err) {
      if (!err?.response) {
        notificationRef.current?.addNotification(t("message.servererror"), 3000);
      } else if (err.response.status === 429) {
        notificationRef.current?.addNotification(
          err.response.data.error || t("message.ratelimit"),
          5000
        );
      } else if (err.response.data && err.response.data.error) {
        notificationRef.current?.addNotification(err.response.data.error, 3000);
      } else {
        notificationRef.current?.addNotification(t("registration.incorrectpwdus"), 3000);
      }
    }
  };

  return (
    <>
      <Notifications ref={notificationRef} />
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800"
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <motion.input
          ref={inputRef}
          className="text-1xl h-16 w-3xs max-w-5xl rounded-lg border-2 border-sky-400 bg-white p-2 text-center text-gray-900 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none md:w-[55vw] md:text-2xl lg:h-20 lg:w-[70vw] lg:text-3xl dark:border-sky-500 dark:bg-slate-700 dark:text-gray-100"
          type="text"
          placeholder={t("registration.loginPlaceholder")}
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
          }}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          required
        />
        <PasswordInput
          className="text-1xl h-16"
          placeholder={t("registration.passwordPlaceholder")}
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
          minLength={5}
        />
        <Registrsubmit>{t("registration.submit")}</Registrsubmit>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2, ease: "easeOut" }}>
          <Link
            className="text-lg text-sky-600 underline dark:text-sky-400"
            to={CLIENT_ROUTES.REGISTRATION}
          >
            {t("registration.donthaveacc")}
          </Link>
        </motion.div>
      </motion.form>
    </>
  );
}
export default Signinform;
