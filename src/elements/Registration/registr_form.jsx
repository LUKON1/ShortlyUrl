import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import Notifications from "../shared/messagewindow";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Registrsubmit from "../shared/registr_submit";
import { useTranslation } from "react-i18next";
import useAuth from "../../utils/useAuth";
import { validateLogin } from "../../utils/loginvalidate";
import { CLIENT_ROUTES } from "../../utils/clientRoutes.js";
import PasswordInput from "../shared/PasswordInput";
import PasswordStrength from "../shared/PasswordStrength";

function Registrform() {
  const API_REGISTR = "/user/registr";
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [confPwd, setConfPwd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const notificationRef = useRef();
  const inputRef = useRef();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateLogin(user)) {
        notificationRef.current?.addNotification(t("registration.invalidLogin"), 3000);
        return;
      }
      if (pwd !== confPwd) {
        notificationRef.current?.addNotification(t("registration.pwddif"), 3000);
        return;
      }

      const anonymousLinks = JSON.parse(localStorage.getItem("anonymousLinks") || "[]");

      const response = await axios.post(
        API_REGISTR,
        JSON.stringify({ user, pwd, anonymousCodes: anonymousLinks }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      const userId = response?.data?.userId;
      console.log(userId);
      setAuth({ user, pwd, accessToken, userId });
      setUser("");
      setPwd("");
      setConfPwd("");

      // Clear anonymous links as they are now transferred
      localStorage.removeItem("anonymousLinks");

      navigate(CLIENT_ROUTES.PROFILE);
    } catch (err) {
      if (err.response) {
        if (err.response.data.error === "Username already exists") {
          notificationRef.current?.addNotification(t("registration.Usalreadyexists"), 3000);
        }
      } else {
        notificationRef.current?.addNotification(t("registration.registrationError"), 3000);
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
          className="text-1xl h-16 w-3xs max-w-5xl rounded-lg border-2 border-sky-400 bg-white p-2 text-center text-gray-900 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none md:w-[55vw] md:text-2xl lg:h-20 lg:w-[70vw] lg:text-3xl dark:border-sky-500 dark:bg-slate-700 dark:text-gray-100"
          type="text"
          placeholder={t("registration.loginPlaceholder")}
          value={user}
          ref={inputRef}
          onChange={(e) => {
            setUser(e.target.value);
          }}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          required
        />

        <div className="flex w-full flex-col items-center gap-2">
          <PasswordInput
            className="text-1xl h-16"
            placeholder={t("registration.passwordPlaceholder")}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
            minLength={5}
            externalShowPassword={showPassword}
            onToggle={setShowPassword}
          />
          <PasswordStrength password={pwd} />
        </div>

        <PasswordInput
          className="text-1xl h-16"
          placeholder={t("registration.passwordPlaceholderagain")}
          value={confPwd}
          onChange={(e) => setConfPwd(e.target.value)}
          required
          minLength={5}
          externalShowPassword={showPassword}
          hideToggle={true}
        />
        <Registrsubmit>{t("registration.submit")}</Registrsubmit>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2, ease: "easeOut" }}>
          <Link
            className="text-lg text-sky-600 underline dark:text-sky-400"
            to={CLIENT_ROUTES.SIGNIN}
          >
            {t("registration.haveanacc")}
          </Link>
        </motion.div>
      </motion.form>
    </>
  );
}
export default Registrform;
