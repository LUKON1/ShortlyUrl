import { useState, useRef, useEffect } from "react";
import Notifications from "../shared/messagewindow";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Registrsubmit from "../shared/registr_submit";
import { useTranslation } from "react-i18next";
import useAuth from "../../utils/useAuth";
import { validateLogin } from "../../utils/loginvalidate";

function Registrform() {
	const API_REGISTR = "/registr";
	const [user, setUser] = useState("");
	const [pwd, setPwd] = useState("");
	const [confPwd, setConfPwd] = useState("");
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
				notificationRef.current?.addNotification(
					t("registration.invalidLogin"),
					3000
				);
				return;
			}
			if (pwd !== confPwd) {
				notificationRef.current?.addNotification(
					t("registration.pwddif"),
					3000
				);
				return;
			}
			const response = await axios.post(
				API_REGISTR,
				JSON.stringify({ user, pwd }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			const accessToken = response?.data?.accessToken;
			const userId = response?.data?.userId;
			setAuth({ user, pwd, accessToken, userId });
			setUser("");
			setPwd("");
			setConfPwd("");
			navigate("/myurls");
		} catch (err) {
			if (err.response) {
				if (err.response.data.error === "Username already exists") {
					notificationRef.current?.addNotification(
						t("registration.Usalreadyexists"),
						3000
					);
				}
			} else {
				notificationRef.current?.addNotification(
					t("registration.registrationError"),
					3000
				);
			}
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
					value={user}
					ref={inputRef}
					onChange={(e) => {
						setUser(e.target.value);
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
					value={pwd}
					onChange={(e) => setPwd(e.target.value)}
					required
					minLength={5}
				/>
				<input
					className="transition-all duration-200 ease-out text-center
               p-2 h-16 lg:h-20  text-1xl md:text-2xl lg:text-3xl border-1
                rounded-md max-w-5xl border-sky-400 w-3xs md:w-[55vw]
                 lg:w-[70vw]"
					type="password"
					placeholder={t("registration.passwordPlaceholderagain")}
					value={confPwd}
					onChange={(e) => setConfPwd(e.target.value)}
					required
					minLength={5}
				/>
				<Registrsubmit>{t("registration.submit")}</Registrsubmit>
				<Link
					className="underline text-lg hover:text-sky-600"
					to={"/signin"}
				>
					{t("registration.haveanacc")}
				</Link>
			</form>
		</>
	);
}
export default Registrform;
