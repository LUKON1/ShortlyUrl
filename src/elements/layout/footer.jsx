import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeProvider";
import { CLIENT_ROUTES } from "../../utils/clientRoutes.js";
import BetaBanner from "./BetaBanner.jsx";

import { useState } from "react";
import BugReportModal from "../shared/BugReportModal.jsx";

function Footer() {
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <footer
      className="relative mt-20 bg-slate-900 dark:bg-slate-800"
      style={{ transition: "var(--transition-bg)" }}
    >
      <BugReportModal isOpen={isBugModalOpen} closeModal={() => setIsBugModalOpen(false)} />
      <BetaBanner />
      <motion.button
        className="absolute -top-5 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 touch-manipulation items-center justify-center rounded-full text-white shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title={t("myurls.topTitle")}
        aria-label={t("myurls.topTitle")}
        animate={{
          backgroundColor: isDark ? "#334155" : "#f43f5e", // slate-700 : rose-500
        }}
        whileHover={{
          y: -16, // -translate-y-4
          scale: 1.1,
          backgroundColor: isDark ? "#475569" : "#fb7185", // slate-600 : rose-400
        }}
        whileTap={{
          scale: 0.95,
        }}
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-72 md:gap-x-8 lg:grid-cols-4">
            {/* Company Info */}
            <div>
              <h3 className="mb-4 text-2xl font-bold text-white">
                {t("footer.companyName", "ShortlyURL")}
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                {t(
                  "footer.companyDesc",
                  "Shorten your URLs and track analytics with our modern URL shortener service."
                )}
              </p>
            </div>

            {/* Information */}
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">
                {t("footer.information", "Information")}
              </h4>
              <ul className="space-y-2">
                <li>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Link to={CLIENT_ROUTES.FEATURES} className="text-sky-300 hover:text-sky-400">
                      {t("footer.features", "Features")}
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Link to={CLIENT_ROUTES.HOME} className="text-slate-300 hover:text-white">
                      {t("footer.home", "Home")}
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Link to={CLIENT_ROUTES.ABOUT} className="text-slate-300 hover:text-white">
                      {t("footer.about", "About us")}
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Link to={CLIENT_ROUTES.CONTACT} className="text-slate-300 hover:text-white">
                      {t("footer.contact", "Contact us")}
                    </Link>
                  </motion.div>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">
                {t("footer.community", "Community")}
              </h4>
              <ul className="space-y-2">
                <li>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Link to={CLIENT_ROUTES.FAQ} className="text-slate-300 hover:text-white">
                      {t("footer.faq", "FAQ")}
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsBugModalOpen(true);
                      }}
                      className="group flex items-center gap-2 text-rose-400 hover:text-rose-300"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
                      </span>
                      {t("footer.reportBug", "Report a Bug")}
                    </a>
                  </motion.div>
                </li>
                <li>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Link to={CLIENT_ROUTES.SIGNIN} className="text-slate-300 hover:text-white">
                      {t("footer.login", "Login")}
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Link
                      to={CLIENT_ROUTES.REGISTRATION}
                      className="text-slate-300 hover:text-white"
                    >
                      {t("footer.signup", "Sign Up")}
                    </Link>
                  </motion.div>
                </li>
              </ul>
            </div>

            {/* Copyright & Credits */}
            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">
                {t("footer.legal", "Legal")}
              </h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p>{t("footer.copyright", "© ShortlyURL. All rights reserved.")}</p>
                <p>{t("footer.license", "BSL 1.1 License")}</p>
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
