import { useState } from "react";
import { useTranslation } from "react-i18next";

function LangCheckBox() {
	const { i18n } = useTranslation();
	const [isChecked, setIsChecked] = useState(i18n.language === "en");
	const handleCheck = (e) => {
		setIsChecked(e.target.checked);
		if (isChecked) {
			i18n.changeLanguage("ru");
			localStorage.setItem("lang", "ru");
		} else {
			i18n.changeLanguage("en");
			localStorage.setItem("lang", "en");
		}
	};

	return (
		<label className="z-50 relative inline-flex items-center cursor-pointer">
			<input
				type="checkbox"
				checked={isChecked}
				onChange={handleCheck}
				className="sr-only peer"
			/>
			<div
				className="group peer ring-0 bg-rose-500 rounded-full outline-none
        duration-300 w-24 h-12 after:duration-300
        peer-checked:bg-rose-500 transition-all ease-in-out
        peer-focus:outline-none after:content-['']
        after:rounded-full after:absolute after:bg-rose-50 after:outline-none
        after:h-10 after:w-10 after:top-1
        after:left-1
        peer-checked:after:translate-x-12 peer-hover:after:scale-95"
			>
				{isChecked && (
					<div className="absolute select-none z-10 top-1 left-1 flex items-center justify-center w-10 h-10 text-rose-50">
						EN
					</div>
				)}
				{!isChecked && (
					<div className="absolute select-none z-10 top-1 left-13 flex items-center justify-center w-10 h-10 text-rose-50">
						RU
					</div>
				)}
			</div>
		</label>
	);
}
export default LangCheckBox;
