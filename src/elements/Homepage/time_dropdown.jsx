import { useState, useRef, useEffect } from "react";

function TimeDropdown({ value, onChange, options, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption = options.find((opt) => opt.value === value) || options[0];

  const handleOptionChange = (optValue) => {
    onChange(optValue);
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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ transition: "var(--transition-bg)" }}
        className={`flex touch-manipulation items-center gap-2 rounded border border-sky-400 px-2 py-1 text-center focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-sky-500 dark:bg-slate-700 ${className || ""}`}
      >
        <span>{currentOption.label}</span>
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
        <div className="absolute top-full left-0 z-60 mt-2 min-w-[120px] overflow-hidden rounded-lg bg-white shadow-lg dark:bg-slate-800">
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => handleOptionChange(opt.value)}
              style={{ transition: "var(--transition-bg)" }}
              className={`z-60 flex w-full touch-manipulation items-center px-4 py-2 text-left transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                opt.value === value
                  ? "bg-slate-200 font-semibold text-slate-800 dark:bg-slate-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TimeDropdown;
