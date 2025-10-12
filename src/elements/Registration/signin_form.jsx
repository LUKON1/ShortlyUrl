import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "../shared/messagewindow";
import Registrsubmit from "../shared/registr_submit";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";
import useAuth from "../../utils/useAuth";

function Signinform() {
  const API_SIGNIN = "user/login";
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
      navigate("/myurls");
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
        className="flex flex-col transition-all duration-200 ease-out gap-5"
      >
        <input
          ref={inputRef}
          className="transition-all duration-200 ease-out text-center
               p-2 h-16 lg:h-20  text-1xl md:text-2xl lg:text-3xl border
                rounded-md max-w-5xl border-sky-400 w-3xs md:w-[55vw]
                 lg:w-[70vw]"
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
               p-2 h-16 lg:h-20  text-1xl md:text-2xl lg:text-3xl border
                rounded-md max-w-5xl border-sky-400 w-3xs md:w-[55vw]
                 lg:w-[70vw]"
          type="password"
          placeholder={t("registration.passwordPlaceholder")}
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
          minLength={5}
        />
        <Registrsubmit>{t("registration.submit")}</Registrsubmit>
        <Link className="underline text-lg hover:text-sky-600" to={"/registration"}>{t("registration.donthaveacc")}</Link>
      </form>
    </>
  );
}
export default Signinform;
