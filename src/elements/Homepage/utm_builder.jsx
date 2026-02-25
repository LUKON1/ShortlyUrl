import { useTranslation } from "react-i18next";
import crossIcon from "../../assets/cross.svg";

function UtmBuilder({ utmData, onChange }) {
  const { t } = useTranslation();

  const handleInputChange = (field, value) => {
    onChange({ ...utmData, [field]: value });
  };

  const hasAnyUtm = Object.values(utmData).some((val) => val.trim() !== "");

  const inputClass =
    "w-full min-w-0 rounded-md border border-sky-200 bg-sky-50/50 px-3 py-1.5 text-sm text-gray-900 transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900/60 dark:text-gray-100 dark:focus:border-sky-400 dark:focus:ring-sky-400";

  return (
    <div>
      {/* Description */}
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        {t("homepage.utm.description")}
      </p>

      {/* UTM fields */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-end">
        {/* Source */}
        <div className="min-w-0 space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Source (utm_source) <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={utmData.source}
            onChange={(e) => handleInputChange("source", e.target.value)}
            placeholder="google, newsletter, etc."
            className={inputClass}
          />
        </div>

        {/* Medium */}
        <div className="min-w-0 space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Medium (utm_medium)
          </label>
          <input
            type="text"
            value={utmData.medium}
            onChange={(e) => handleInputChange("medium", e.target.value)}
            placeholder="cpc, banner, email"
            className={inputClass}
          />
        </div>

        {/* Campaign */}
        <div className="min-w-0 space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Campaign (utm_campaign)
          </label>
          <input
            type="text"
            value={utmData.campaign}
            onChange={(e) => handleInputChange("campaign", e.target.value)}
            placeholder="spring_sale"
            className={inputClass}
          />
        </div>

        {/* Term */}
        <div className="min-w-0 space-y-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Term (utm_term)
          </label>
          <input
            type="text"
            value={utmData.term}
            onChange={(e) => handleInputChange("term", e.target.value)}
            placeholder="running shoes"
            className={inputClass}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 space-y-1 sm:col-span-full">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Content (utm_content)
          </label>
          <input
            type="text"
            value={utmData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="logolink, textlink"
            className={inputClass}
          />
        </div>
      </div>

      {/* Clear button */}
      {hasAnyUtm && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() =>
              onChange({ source: "", medium: "", campaign: "", term: "", content: "" })
            }
            className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:border-red-300 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-900/40"
          >
            <img src={crossIcon} alt="" className="h-3 w-3 dark:invert" />
            {t("homepage.utm.clear")}
          </button>
        </div>
      )}
    </div>
  );
}

export default UtmBuilder;
