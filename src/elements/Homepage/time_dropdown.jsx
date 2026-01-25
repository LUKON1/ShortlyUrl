import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

function TimeDropdown({ value, onChange, options, className }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const dropdownRef = useRef(null);

  // Constants
  const ONE_YEAR_SECONDS = 31536000;

  // Custom Input State
  const [customValue, setCustomValue] = useState("1");
  const [customUnit, setCustomUnit] = useState(86400); // Default to Day

  const units = [
    { label: t("homepage.urlopt.urtime.minutes"), value: 60 },
    { label: t("homepage.urlopt.urtime.hour"), value: 3600 },
    { label: t("homepage.urlopt.urtime.day"), value: 86400 },
    { label: t("homepage.urlopt.urtime.week"), value: 604800 },
    { label: t("homepage.urlopt.urtime.month"), value: 2592000 },
    { label: t("homepage.urlopt.urtime.year"), value: 31536000 },
  ];

  const currentOption = options.find((opt) => opt.value === value);
  const displayLabel = currentOption
    ? currentOption.label
    : isCustomMode
      ? `${customValue || 1} ${units.find((u) => u.value === customUnit)?.label || ""}`
      : t("homepage.urlopt.urtime.custom");

  const handleOptionChange = (optValue) => {
    onChange(optValue);
    setIsCustomMode(false);
    setIsOpen(false);
  };

  const handleCustomSubmit = () => {
    const val = parseInt(customValue) || 1; // Default to 1 if empty/invalid
    let totalSeconds = val * customUnit;

    // Enforcement of max limit (1 Year)
    if (totalSeconds > ONE_YEAR_SECONDS) {
      totalSeconds = ONE_YEAR_SECONDS;
      setCustomValue("1");
      setCustomUnit(ONE_YEAR_SECONDS);
    }

    // Min limit (1 minute)
    if (totalSeconds < 60) {
      totalSeconds = 60;
    }

    onChange(totalSeconds);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomSubmit();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setIsCustomMode(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsCustomMode(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex touch-manipulation items-center gap-2 rounded-lg border-2 border-sky-400 bg-white px-3 py-1.5 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none dark:border-sky-500 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700 ${className || ""}`}
      >
        <span className="max-w-[120px] truncate">{displayLabel}</span>
        <svg
          className={`h-4 w-4 text-sky-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="ring-opacity-5 absolute top-full right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black focus:outline-none dark:border-slate-700 dark:bg-slate-800">
          <div className="p-1">
            {!isCustomMode ? (
              <>
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleOptionChange(opt.value)}
                    className={`flex w-full items-center rounded-lg px-4 py-2 text-sm ${
                      value === opt.value
                        ? "bg-sky-50 text-sky-700 dark:bg-slate-700 dark:text-sky-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
                <div className="my-1 h-px bg-gray-100 dark:bg-slate-700" />
                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className="flex w-full items-center rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-700"
                >
                  {t("homepage.urlopt.urtime.custom")}...
                </button>
              </>
            ) : (
              <div className="p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                    {t("homepage.urlopt.urtime.custom")}
                  </span>
                  <button
                    onClick={() => setIsCustomMode(false)}
                    className="text-xs text-sky-500 hover:text-sky-600 dark:text-sky-400"
                  >
                    Back
                  </button>
                </div>

                <div className="mb-3 flex gap-2">
                  <input
                    autoFocus
                    type="number"
                    min="1"
                    max="999"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                  <select
                    value={customUnit}
                    onChange={(e) => setCustomUnit(parseInt(e.target.value))}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    {units.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleCustomSubmit}
                  className="w-full rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none dark:hover:bg-sky-400"
                >
                  {t("homepage.urlopt.urtime.confirm")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeDropdown;
