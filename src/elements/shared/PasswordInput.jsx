import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const PasswordInput = ({
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  className,
  externalShowPassword, // Boolean: if passed, component becomes controlled
  onToggle, // Function: required if externalShowPassword is use
  hideToggle = false, // Boolean: if true, hides the eye button for this input
}) => {
  const [internalShowPassword, setInternalShowPassword] = useState(false);
  const { t } = useTranslation();

  const isControlled = typeof externalShowPassword === "boolean";
  const showPassword = isControlled ? externalShowPassword : internalShowPassword;

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle(!showPassword);
    } else {
      setInternalShowPassword(!showPassword);
    }
  };

  return (
    <div className="relative w-full">
      <motion.input
        className={`w-full max-w-5xl rounded-lg border-2 border-sky-400 bg-white p-2 text-center text-gray-900 shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none md:text-xl lg:text-2xl dark:border-sky-500 dark:bg-slate-700 dark:text-gray-100 ${className || ""}`}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        required={required}
        minLength={minLength}
      />
      {!hideToggle && (
        <button
          type="button"
          onClick={handleToggle}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-sky-600 focus:outline-none dark:text-gray-400 dark:hover:text-sky-400"
          tabIndex={-1}
        >
          {showPassword ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default PasswordInput;
