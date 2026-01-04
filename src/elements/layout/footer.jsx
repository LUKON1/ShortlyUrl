import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeProvider";

function Footer() {
  const location = useLocation();
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <footer className="relative mt-20 bg-slate-900 dark:bg-slate-800" style={{ transition: "var(--transition-bg)" }}>
      <motion.button
        className="touch-manipulation absolute -top-5 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full text-white shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title={t("myurls.topTitle")}
        aria-label={t("myurls.topTitle")}
        animate={{
          backgroundColor: isDark ? "#334155" : "#f43f5e" // slate-700 : rose-500
        }}
        whileHover={{
          y: -16, // -translate-y-4
          scale: 1.1,
          backgroundColor: isDark ? "#475569" : "#fb7185" // slate-600 : rose-400
        }}
        whileTap={{
          scale: 0.95
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
      <div className="bg-slate-900 py-12 dark:bg-slate-800" style={{ transition: "var(--transition-bg)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("footer.companyName", "ShortlyURL")}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t("footer.companyDesc", "Shorten your URLs and track analytics with our modern URL shortener service.")}
              </p>
            </div>

            {/* Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                {t("footer.information", "Information")}
              </h4>
              <ul className="space-y-2">
                <li>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                    <Link to="/" className="text-slate-300 hover:text-white">
                      {t("footer.home", "Home")}
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                    <Link to="/privacy" className="text-slate-300 hover:text-white">
                      {t("footer.about", "About us")}
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                    <a href="mailto:support@shortlyurl.com" className="text-slate-300 hover:text-white">
                      {t("footer.contact", "Contact us")}
                    </a>
                  </motion.div>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                {t("footer.community", "Community")}
              </h4>
              <ul className="space-y-2">
                <li>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                    <a href="#" className="text-slate-300 hover:text-white">
                      {t("footer.faq", "FAQ")}
                    </a>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                    <Link to="/signin" className="text-slate-300 hover:text-white">
                      {t("footer.login", "Login")}
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                    <Link to="/registration" className="text-slate-300 hover:text-white">
                      {t("footer.signup", "Sign Up")}
                    </Link>
                  </motion.div>
                </li>
              </ul>
            </div>

            {/* Copyright & Credits */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                {t("footer.legal", "Legal")}
              </h4>
              <div className="text-slate-400 text-sm space-y-2">
                <p>{t("footer.copyright", "© ShortlyURL. All rights reserved.")}</p>
                <p>{t("footer.license", "MIT License")}</p>
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
