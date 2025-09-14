import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
function Footer() {
  const location = useLocation();
   const {t} = useTranslation()
  return (
    <footer className="transition-all  duration-200 ease-out bg-rose-400 w-full md:h-[20vh] h-[35vh] relative mt-20 flex flex-col items-center">
      {location.pathname === "/myurls" && <a className="text-2xl font-bold text-rose-700 hover:text-rose-900 transition-colors absolute p-2 -top-16" href="#top">
            {t("myurls.top")}
      </a>}
      <div className="w-[70vw] h-full flex flex-col text-base md:text-xl lg:text-2xl justify-center items-center text-rose-50 font-bold text-left">
        {t('footer.discription')}
      </div>
      <div className="font-bold text-rose-50 mb-1.5">powered by <a href="https://github.com/LUKON1"/></div>
    </footer>
  );
}
export default Footer;
