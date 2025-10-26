import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

function LangDropdown() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "ru", label: "RU", flag: "🇷🇺" },
    { code: "en", label: "EN", flag: "🇺🇸" },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("lang", langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-rose-500 dark:bg-slate-700
                   text-rose-50 dark:text-slate-200 rounded-lg font-semibold
                   hover:bg-rose-600 dark:hover:bg-slate-600 transition-colors duration-200"
      >
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-800
                        rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2 text-left flex items-center gap-2
                         hover:bg-rose-100 dark:hover:bg-slate-700 transition-colors duration-150
                         ${lang.code === i18n.language
                           ? "bg-rose-50 dark:bg-slate-700 text-rose-700 dark:text-rose-400 font-semibold"
                           : "text-gray-700 dark:text-gray-300"}`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LangDropdown;
