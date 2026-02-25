import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeProvider";
import { CLIENT_ROUTES } from "../../utils/clientRoutes.js";

function Footer() {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <footer
      className="relative mt-20 bg-slate-900 dark:bg-slate-800"
      style={{ transition: "var(--transition-bg)" }}
    >
      {/* Scroll to top button */}
      <motion.button
        className="absolute -top-5 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 touch-manipulation items-center justify-center rounded-full text-white shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title={t("myurls.topTitle")}
        aria-label={t("myurls.topTitle")}
        animate={{
          backgroundColor: isDark ? "#334155" : "#f43f5e",
        }}
        whileHover={{
          y: -16,
          scale: 1.1,
          backgroundColor: isDark ? "#475569" : "#fb7185",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>

      {/* Main footer content */}
      <div
        className="bg-slate-900 py-12 dark:bg-slate-800"
        style={{ transition: "var(--transition-bg)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Company Info */}
            <div>
              <h3 className="mb-4 text-2xl font-bold text-white">
                {t("footer.companyName", "ShortlyURL")}
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                {t(
                  "footer.companyDesc",
                  "Self-hosted URL shortener with analytics, UTM tags and QR codes."
                )}
              </p>
            </div>

            {/* Features link */}
            <div>
              <Link to={CLIENT_ROUTES.FEATURES}>
                <h4 className="mb-4 text-lg font-semibold text-white transition-colors hover:text-sky-400">
                  Функционал и использование
                </h4>
              </Link>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>Сокращение ссылок и кастомные алиасы</li>
                <li>UTM-конструктор и QR-коды</li>
                <li>Аналитика кликов и Share-страница</li>
                <li>Время жизни и панель управления</li>
              </ul>
              <Link
                to={CLIENT_ROUTES.FEATURES}
                className="mt-3 inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300"
              >
                Подробнее
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">
                {t("footer.legal", "Legal")}
              </h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p>{t("footer.copyright", "© ShortlyURL. All rights reserved.")}</p>
                <p>{t("footer.license")}</p>
                <p>
                  {t("footer.poweredBy", "Created by")}{" "}
                  <motion.a
                    className="text-blue-400 hover:text-blue-300"
                    href="https://github.com/LUKON1"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    LUKON
                  </motion.a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
