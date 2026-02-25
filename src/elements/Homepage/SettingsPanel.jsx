import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import UtmBuilder from "./utm_builder.jsx";
import crossIcon from "../../assets/cross.svg";

/* Accordion section wrapper */
function Section({ id, icon, title, summary, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-sky-100 last:border-b-0 dark:border-slate-700/60">
      {/* Section header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer touch-manipulation items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-sky-50/50 md:px-5 md:py-3.5 dark:hover:bg-slate-700/30"
      >
        {/* Icon */}
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100/80 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400">
          {icon}
        </span>
        {/* Title and summary */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
          {!isOpen && summary && (
            <span className="truncate text-xs text-gray-400 dark:text-gray-500">{summary}</span>
          )}
        </div>
        {/* Chevron */}
        <svg
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 dark:text-gray-500 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Section content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="motion-safe overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-4 pt-1 pb-4 md:px-5 md:pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Inline chip selector for lifetime presets + custom mode */
function LifetimeSelector({ value, onChange, options }) {
  const { t } = useTranslation();
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("1");
  const [customUnit, setCustomUnit] = useState(86400);

  const ONE_YEAR_SECONDS = 31536000;

  const units = [
    { label: t("homepage.urlopt.urtime.minutes"), value: 60 },
    { label: t("homepage.urlopt.urtime.hour"), value: 3600 },
    { label: t("homepage.urlopt.urtime.day"), value: 86400 },
    { label: t("homepage.urlopt.urtime.week"), value: 604800 },
    { label: t("homepage.urlopt.urtime.month"), value: 2592000 },
    { label: t("homepage.urlopt.urtime.year"), value: 31536000 },
  ];

  const isPreset = options.some((opt) => opt.value === value);

  const handleCustomSubmit = () => {
    const val = parseInt(customValue) || 1;
    let totalSeconds = val * customUnit;
    if (totalSeconds > ONE_YEAR_SECONDS) {
      totalSeconds = ONE_YEAR_SECONDS;
      setCustomValue("1");
      setCustomUnit(ONE_YEAR_SECONDS);
    }
    if (totalSeconds < 60) totalSeconds = 60;
    onChange(totalSeconds);
    setIsCustomMode(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomSubmit();
    } else if (e.key === "Escape") {
      setIsCustomMode(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Preset chips */}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              onChange(opt.value);
              setIsCustomMode(false);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              value === opt.value && !isCustomMode
                ? "bg-sky-500 text-white shadow-sm dark:bg-sky-600"
                : "bg-sky-50 text-gray-600 hover:bg-sky-100 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
        {/* Custom chip */}
        <button
          type="button"
          onClick={() => setIsCustomMode(true)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            isCustomMode || !isPreset
              ? "bg-sky-500 text-white shadow-sm dark:bg-sky-600"
              : "bg-sky-50 text-gray-600 hover:bg-sky-100 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
          }`}
        >
          {t("homepage.urlopt.urtime.custom")}
        </button>
      </div>

      {/* Custom input */}
      <AnimatePresence initial={false}>
        {isCustomMode && (
          <motion.div
            className="motion-safe overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="number"
                min="1"
                max="999"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-18 rounded-md border border-sky-200 bg-sky-50/50 px-2.5 py-1.5 text-sm text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900/60 dark:text-white"
              />
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(parseInt(e.target.value))}
                className="flex-1 rounded-md border border-sky-200 bg-sky-50/50 px-2.5 py-1.5 text-sm text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900/60 dark:text-white"
              >
                {units.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleCustomSubmit}
                className="shrink-0 rounded-md bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 dark:hover:bg-sky-400"
              >
                {t("homepage.urlopt.urtime.confirm")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Icons */
const ClockIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LinkIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);

const TagIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

function SettingsPanel({
  urlTime,
  setUrlTime,
  urlTimeOptions,
  customAlias,
  setCustomAlias,
  utm,
  setUtm,
}) {
  const { t } = useTranslation();

  // Accordion state
  const [openSections, setOpenSections] = useState({ lifetime: true, alias: false, utm: false });

  const toggle = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Summaries for collapsed state
  const currentTimeLabel = urlTimeOptions.find((opt) => opt.value === urlTime)?.label || "";

  const aliasSummary = customAlias
    ? `${window.location.host}/${customAlias}`
    : t("homepage.settings.aliasSummary");

  const hasAnyUtm = Object.values(utm).some((val) => val.trim() !== "");
  const utmSummary = hasAnyUtm
    ? Object.entries(utm)
        .filter(([, v]) => v.trim())
        .map(([k]) => k)
        .join(", ")
    : t("homepage.settings.utmSummary");

  return (
    <div className="w-full overflow-hidden rounded-xl border border-sky-100 bg-white/95 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/95">
      {/* Lifetime section */}
      <Section
        id="lifetime"
        icon={ClockIcon}
        title={t("homepage.settings.lifetime")}
        summary={currentTimeLabel}
        isOpen={openSections.lifetime}
        onToggle={() => toggle("lifetime")}
      >
        <LifetimeSelector value={urlTime} onChange={setUrlTime} options={urlTimeOptions} />
      </Section>

      {/* Alias section */}
      <Section
        id="alias"
        icon={LinkIcon}
        title={t("homepage.settings.alias")}
        summary={aliasSummary}
        isOpen={openSections.alias}
        onToggle={() => toggle("alias")}
      >
        <div className="flex items-center overflow-hidden rounded-md border border-sky-200 bg-sky-50/50 dark:border-slate-600 dark:bg-slate-900/60">
          <span className="shrink-0 border-r border-sky-200 bg-sky-100/80 px-2.5 py-2 text-xs font-medium text-sky-700 select-none dark:border-sky-800 dark:bg-sky-900/40 dark:text-sky-300">
            {window.location.host}/
          </span>
          <input
            type="text"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
            placeholder={t("homepage.urlopt.aliasPlaceholder")}
            className="w-full min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder-gray-500"
            maxLength={30}
          />
          {/* Character counter */}
          {customAlias.length > 0 && (
            <div className="flex shrink-0 items-center gap-1.5 pr-2.5">
              <span
                className={`text-xs select-none ${
                  customAlias.length < 4
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {customAlias.length}/30
              </span>
              {/* Clear alias */}
              <button
                type="button"
                onClick={() => setCustomAlias("")}
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full opacity-50 transition-opacity hover:opacity-100"
              >
                <img className="h-3.5 w-3.5 dark:invert" src={crossIcon} alt="Clear" />
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* UTM section */}
      <Section
        id="utm"
        icon={TagIcon}
        title={t("homepage.settings.utm")}
        summary={utmSummary}
        isOpen={openSections.utm}
        onToggle={() => toggle("utm")}
      >
        <UtmBuilder utmData={utm} onChange={setUtm} />
      </Section>
    </div>
  );
}

export default SettingsPanel;
