import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <footer className="relative mt-20 flex h-[38vh] w-full flex-col items-center justify-between bg-rose-400 shadow-inner transition-all duration-200 ease-out md:h-[22vh] dark:bg-slate-800">
      {location.pathname === "/profile" && (
        <button
          className="absolute -top-5 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition-all duration-200 hover:-translate-y-4 hover:scale-110 hover:bg-rose-600 dark:bg-slate-700 dark:hover:bg-slate-600"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title={t("myurls.topTitle")}
          aria-label={t("myurls.topTitle")}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
      <div className="grid w-[70vw] grid-cols-1 gap-4 pt-6 text-center text-base font-bold text-rose-50 md:grid-cols-3 md:text-xl lg:text-2xl dark:text-slate-200">
        <div className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
            <use href="#mail" />
          </svg>
          <p>{t("footer.support")}</p>
        </div>
        <p className="flex items-center justify-center">{t("footer.copyright")}</p>
        <Link
          to="/privacy"
          className="flex items-center justify-center text-lg text-rose-100 underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-rose-900 md:text-xl dark:text-slate-300 dark:hover:text-rose-400"
        >
          {t("header.about")}
        </Link>
      </div>
      <div className="mb-1.5 text-sm font-bold text-rose-50 md:text-base dark:text-slate-300">
        powered by{" "}
        <a
          className="text-blue-400 underline transition-colors hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
          href="https://github.com/LUKON1"
        >
          <svg className="mr-1 inline h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <use href="#github" />
          </svg>
          LUKON
        </a>{" "}
        and supported by{" "}
        <a
          className="text-blue-400 underline transition-colors hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
          href="https://github.com/Kribzdy"
        >
          <svg className="mr-1 inline h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <use href="#github" />
          </svg>
          Kribzdy
        </a>
      </div>
    </footer>
  );
}
export default Footer;
