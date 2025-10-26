import { useTranslation } from "react-i18next";

function SubmitButton({ isLoading }) {
 const {t} = useTranslation()
  return (
    <button
      type="submit"
      disabled={isLoading}
      className=" text-1xl md:text-2xl lg:text-3xl  active:scale-95 duration-200 relative group cursor-pointer text-white dark:text-slate-900 overflow-hidden h-16 lg:h-20 w-64 rounded-lg shadow-lg hover:shadow-xl bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500 p-2 flex justify-center items-center font-extrabold touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="absolute right-32 -top-4 group-hover:top-1 group-hover:right-2 group-active:top-1 group-active:right-2 group-focus:top-1 group-focus:right-2 z-10 w-40 h-40 rounded-full group-hover:scale-150 group-active:scale-150 group-focus:scale-150 duration-500 bg-rose-300 transition-all ease-out"></div>
      <div className="absolute right-2 -top-4 group-hover:top-1 group-hover:right-2 group-active:top-1 group-active:right-2 group-focus:top-1 group-focus:right-2 z-10 w-32 h-32 rounded-full group-hover:scale-150 group-active:scale-150 group-focus:scale-150 duration-500 bg-rose-50 transition-all ease-out"></div>
      <div className="absolute -right-12 top-4 group-hover:top-1 group-hover:right-2 group-active:top-1 group-active:right-2 group-focus:top-1 group-focus:right-2 z-10 w-24 h-24 rounded-full group-hover:scale-150 group-active:scale-150 group-focus:scale-150 duration-500 bg-rose-300 transition-all ease-out"></div>
      <div className="absolute right-20 -top-4 group-hover:top-1 group-hover:right-1 group-active:top-1 group-active:right-2 group-focus:top-1 group-focus:right-2 z-10 w-16 h-16 rounded-full group-hover:scale-150 group-active:scale-150 group-focus:scale-150 duration-500 bg-sky-400 transition-all ease-out"></div>
      <p className="z-10 relative">
        {isLoading ? t('homepage.cutting') : t('homepage.cut')}
      </p>
    </button>
  );
}
export default SubmitButton;
