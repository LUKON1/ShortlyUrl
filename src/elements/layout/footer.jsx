import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
function Footer() {
  const location = useLocation();
   const {t} = useTranslation()
  return (
    <footer className="transition-all duration-200 ease-out bg-rose-400 dark:bg-slate-800 w-full md:h-[22vh] h-[38vh] relative mt-20 flex flex-col items-center shadow-inner">
      {location.pathname === "/profile" && <a className="text-2xl font-bold text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 transition-colors absolute p-2 -top-16" href="#top">
            {t("myurls.top")}
      </a>}
      <div className="w-[70vw] h-full flex flex-col gap-4 text-base md:text-xl lg:text-2xl justify-center items-center text-rose-50 dark:text-slate-200 font-bold text-center pt-6">
        <p>{t('footer.discription')}</p>
        <Link
          to="/about"
          className="text-rose-100 dark:text-slate-300 hover:text-rose-900 dark:hover:text-rose-400
                     text-lg md:text-xl underline decoration-2 underline-offset-4
                     transition-colors duration-200"
        >
          {t("header.about")}
        </Link>
      </div>
      <div className="font-bold text-rose-50 dark:text-slate-300 mb-1.5 text-sm md:text-base">
        powered by <a className="text-blue-400 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200 underline transition-colors" href="https://github.com/LUKON1">LUKON</a> and supported by <a className="text-blue-400 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200 underline transition-colors" href="https://github.com/Kribzdy">Kribzdy</a>
      </div>
    </footer>
  );
}
export default Footer;

