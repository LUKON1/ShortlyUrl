import { useState, useEffect, useRef, useCallback } from "react";
import CopyButton from "./copy_button.jsx";
import SubmitButton from "./submit_button.jsx";
import Qrgen from "./qr_gen.jsx";
import LoadQR_Button from "./loadQR_Button.jsx";
import Notifications from "../shared/messagewindow.jsx";
import { useTranslation } from "react-i18next";
import { containsMyDomain } from "../../utils/containsMyDomain.js";
import axios from "../../api/axios.js";
import useAuth from "../../utils/useAuth.js";

function ShortenerForm() {
	const API_SHORTER = "/cut/shorter";
	const BASE_URL = import.meta.env.VITE_BASE_URL;
	const { t } = useTranslation();
	const { userId } = useAuth();

	const [url, setUrl] = useState("");
	const [shortUrl, setShortUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const notificationRef = useRef();
	const qrContainerRef = useRef(null);
	const inputRef = useRef();

	const [urlTime, setUrlTime] = useState("");
	const urlTimeOptions = [
		{ value: 604800, label: t("homepage.urlopt.urtime.week") },
		{ value: 86400, label: t("homepage.urlopt.urtime.day") },
		{ value: 3600, label: t("homepage.urlopt.urtime.hour") },
		{ value: 2592000, label: t("homepage.urlopt.urtime.month") },
	];

	useEffect(() => {
		inputRef.current.focus();
	}, []);

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();

			if (!url) {
				notificationRef.current?.addNotification(
					t("message.urlblank"),
					3000
				);
				return;
			}

			try {
				if (containsMyDomain(url)) {
					throw new Error();
				}
				setIsLoading(true);

				const response = await axios.post(
					API_SHORTER,
					JSON.stringify({
						url: url,
						urlTime: urlTime,
						userId: userId,
					}),
					{
						headers: { "Content-Type": "application/json" },
					}
				);

				const usercode = response?.data?.usercode;
				if (usercode.length !== 7) {
					throw new Error();
				}

				const shortUrl = `${BASE_URL}${usercode}`;
				setShortUrl(shortUrl);
			} catch (error) {
				notificationRef.current?.addNotification(
					t("message.urlcuterror"),
					3000
				);
			} finally {
				setIsLoading(false);
			}
		},
		[urlTime, url]
	);

	return (
		<div>
			<Notifications ref={notificationRef} />
			<form
				onSubmit={handleSubmit}
				className="flex flex-col
          transition-all duration-200 ease-out"
			>
				<div
					className="flex flex-col items-center
            md:flex-row md:gap-6
            mb-6 md:mb-18 gap-40"
				>
					<div className="felx flex-col relative">
						{url && (
							<button
								className="absolute"
								onClick={() => setUrl("")}
							>
								<img
									className="w-8 h-full
                    hover:cursor-pointer lg:w-10"
									src="/src/assets/cross.svg"
									alt="X"
								/>
							</button>
						)}
						<input
							ref={inputRef}
							className="transition-all duration-200 ease-out
                text-center p-2
                h-16 lg:h-20
                text-1xl md:text-2xl lg:text-3xl
                border-1 rounded-md
                max-w-5xl border-sky-400
                w-3xs md:w-[55vw] lg:w-[70vw"
							type="url"
							value={url}
							onChange={(e) => {
								const url = e?.target.value;
								setUrl(url);
							}}
							placeholder={t("homepage.placeholder")}
						/>
						<div
							className="absolute flex md:flex-row flex-col
                gap-x-2.5 lg:gap-x-10 gap-y-6
                w-full mt-2.5
                bg-rose-50 border border-sky-400
                focus:outline-none py-2 px-1 rounded
                justify-center
                text-xs md:text-lg lg:text-2xl"
						>
							<div
								className="flex flex-row md:gap-2
                  justify-between md:justify-normal"
							>
								<p>{t("homepage.urlopt.urtime.liftimeword")}</p>
								<select
									className="w-30 lg:w-35
                    text-center md:w-20"
									value={urlTime}
									onChange={(e) => {
										setUrlTime(Number(e?.target.value));
									}}
								>
									{urlTimeOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}
										>
											{option.label}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
					<SubmitButton isLoading={isLoading} />
				</div>

				{shortUrl && (
					<div className="flex flex-col items-center mb-60">
						<div
							className="mb-30
                flex flex-col items-center
                md:flex-row gap-5 md:gap-6
                justify-center"
						>
							<div
								className="transition-all duration-200 ease-out
                  flex flex-col items-center justify-center
                  overflow-hidden text-center
                  h-16 p-2 box-border
                  border-1 rounded-md
                  lg:h-20
                  text-1xl md:text-2xl lg:text-3xl
                  max-w-5xl border-sky-400
                  w-3xs md:w-[55vw] lg:w-[70vw"
							>
								<span className="select-all">{shortUrl}</span>
							</div>
							<div className="transition-all duration-200 ease-out">
								<CopyButton shortUrl={shortUrl} />
							</div>
						</div>
						<div
							className="transition-all duration-200 ease-out
                flex flex-col md:flex-col-reverse
                md:gap-8 gap-5"
						>
							<Qrgen
								ShortUrl={shortUrl}
								qrContainerRef={qrContainerRef}
								notificationRef={notificationRef}
							/>
							<LoadQR_Button
								qrContainerRef={qrContainerRef}
								notificationRef={notificationRef}
								url={url}
							/>
						</div>
					</div>
				)}
			</form>
		</div>
	);
}
export default ShortenerForm;
