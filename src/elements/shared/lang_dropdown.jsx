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

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

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
        style={{ transition: "var(--transition-bg)" }}
        className="flex touch-manipulation items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
      >
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.label}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 min-w-[120px] overflow-hidden rounded-lg bg-white shadow-lg dark:bg-slate-800">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              style={{ transition: "var(--transition-bg)" }}
              className={`flex w-full touch-manipulation items-center gap-2 px-4 py-2 text-left transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                lang.code === i18n.language
                  ? "bg-slate-200 font-semibold text-slate-800 dark:bg-slate-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
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
