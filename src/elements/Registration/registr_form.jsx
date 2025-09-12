import { useState, useRef } from "react";
import Notifications from "../messagewindow";
import { useNavigate } from "react-router-dom";
import Registrsubmit from "./registr_submit";
import { useTranslation } from "react-i18next";

function Registrform() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const notificationRef = useRef();
  const { t } = useTranslation(); 
  
  const validateLogin = (login) => {
    const loginRegex = /^[a-zA-Z0-9]{1,15}$/;
    return loginRegex.test(login);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateLogin(login)) {
      notificationRef.current?.addNotification(t('registration.invalidLogin'), 3000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Registr/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userlogin: login, userpassword: password }),
      });
      if (!response.ok) {
        throw new Error(t('registration.registrationError'));
      }
      
      localStorage.setItem("isLoggedIn", "true");
      window.dispatchEvent(new Event('storage'));
      navigate("/myurls");
    } catch (error) {
      notificationRef.current?.addNotification(error.message, 3000);
    }
  };

  return (
    <>
      <Notifications ref={notificationRef} />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col transition-all duration-200 ease-out gap-5"
      >
        <input
          className="transition-all duration-200 ease-out text-center
               p-2 h-16 lg:h-20  text-1xl md:text-2xl lg:text-3xl border-1
                rounded-md max-w-5xl border-sky-400 w-3xs md:w-[55vw]
                 lg:w-[70vw]"
          type="text"
          placeholder={t("registration.loginPlaceholder")}
          value={login}
          onChange={(e) => {
            setLogin(e.target.value);
          }}
          required
        />
        <input
          className="transition-all duration-200 ease-out text-center
               p-2 h-16 lg:h-20  text-1xl md:text-2xl lg:text-3xl border-1
                rounded-md max-w-5xl border-sky-400 w-3xs md:w-[55vw]
                 lg:w-[70vw]"
          type="password"
          placeholder={t("registration.passwordPlaceholder")} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={5}
        />
        <Registrsubmit />
      </form>
    </>
  );
}
export default Registrform;
