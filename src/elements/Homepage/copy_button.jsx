import { useState } from "react";
import { useTranslation } from "react-i18next";
function CopyButton({ shortUrl }) {
	const { t } = useTranslation();
	const [copied, setCopied] = useState("");

	return (
		<button
			type="button"
			className="transition-all duration-200 ease-out hover:bg-rose-400 active:bg-rose-500 bg-rose-300 shadow-md hover:shadow-lg h-16 lg:h-20 w-64 text-1xl md:text-2xl lg:text-3xl  p-4  rounded-md text-rose-950 font-extrabold"
			onClick={() => {
				navigator.clipboard.writeText(shortUrl).then(() => {
					setCopied(true);
					setTimeout(() => {
						setCopied("");
					}, 4000);
				});
			}}
		>
			{copied ? t("homepage.copied") : t("homepage.copy")}
		</button>
	);
}
export default CopyButton;
