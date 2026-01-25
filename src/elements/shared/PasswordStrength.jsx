import React from "react";
import { useTranslation } from "react-i18next";

const PasswordStrength = ({ password }) => {
  const { t } = useTranslation();

  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 7 && /\d/.test(pass)) score += 1;
    if (pass.length > 9 && /[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 1;
    if (pass.length > 11) score += 1;
    return score;
  };

  const score = getStrength(password);

  const getColor = () => {
    if (score === 0) return "bg-gray-200 dark:bg-slate-700";
    if (score <= 1) return "bg-red-500";
    if (score === 2) return "bg-yellow-500";
    if (score === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="w-full max-w-5xl px-1 md:w-[55vw] lg:w-[70vw]">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
        <div
          className={`h-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${(score / 4) * 100}%` }}
        />
        {score > 0 && <span className="sr-only">{labels[score]}</span>}
      </div>
      {/* Optional text label 
      <p className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
        {score > 0 && labels[score]}
      </p>
      */}
    </div>
  );
};

export default PasswordStrength;
