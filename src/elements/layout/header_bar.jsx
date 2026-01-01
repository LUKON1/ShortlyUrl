import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import LangDropdown from "../shared/lang_dropdown";
import ThemeToggle from "../shared/theme_toggle";
import useAuth from "../../utils/useAuth";

function Header_bar() {
  const { t } = useTranslation();
  const {auth} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleToggle = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 500);
    } else {
      setIsOpen(true);
      setIsClosing(false);
    }
  };

  return (
    <header
      className="header min-w-2xs mb-20 md:mb-30 lg:mb-40 flex
         flex-row w-full h-20 relative bg-rose-400 dark:bg-slate-800 items-center
         shadow-lg transition-colors duration-200"
    >
      <div
        className="flex flex-row w-full h-full items-center
       justify-between px-6 lg:px-20 transition-all duration-200 ease-out"
      >
        <div className="">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              onDragStart={(e) => e.preventDefault()}
              className="select-none h-14 w-14 relative group-hover:scale-110 transition-transform duration-200"
              src="/src/assets/home-page.png"
              alt="home"
            />
            <span className="text-xl lg:text-2xl font-bold text-rose-50 dark:text-slate-100">
              ShortlyURL
            </span>
          </Link>
        </div>

        <nav
          className="md:flex md:flex-row gap-6 items-center hidden text-lg md:text-xl
         transition-all duration-200 ease-out"
        >
          <ThemeToggle />
          <LangDropdown />
          {auth?.userId ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "text-rose-900 dark:text-rose-400 px-4 py-2 rounded-lg bg-rose-100 dark:bg-slate-700 font-extrabold transition duration-300 ease-in-out"
                  : "text-rose-100 dark:text-slate-200 px-4 py-2 rounded-lg hover:bg-rose-500 dark:hover:bg-slate-700 font-bold transition duration-300 ease-in-out"
              }
            >
              {t("header.myurls")}
            </NavLink>
          ) : (
            <NavLink
              to="/registration"
              className={({ isActive }) =>
                isActive
                  ? "text-rose-900 dark:text-rose-400 px-4 py-2 rounded-lg bg-rose-100 dark:bg-slate-700 font-extrabold transition duration-300 ease-in-out"
                  : "text-rose-100 dark:text-slate-200 px-4 py-2 rounded-lg hover:bg-rose-500 dark:hover:bg-slate-700 font-bold transition duration-300 ease-in-out"
              }
            >
              {t("header.signup")}
            </NavLink>
          )}
        </nav>
        <div className="md:hidden flex gap-3 items-center">
          <ThemeToggle />
          <button onClick={handleToggle} type="button" className="touch-manipulation">
            {!isOpen ? (
              <img
                src="/src/assets/burger.svg"
                onDragStart={(e) => e.preventDefault()}
                className="select-none h-14 w-14 dark:invert"
                alt="меню"
              />
            ) : (
              <>
                <img
                  src="/src/assets/burger-cross.svg"
                  onDragStart={(e) => e.preventDefault()}
                  className="select-none h-14 w-14 relative z-40 dark:invert"
                  alt="меню"
                />
              </>
            )}
          </button>
        </div>
      </div>
      {(isOpen || isClosing) && (
        <div className="md:hidden">
          <div
            className={`absolute top-20 left-0 bg-rose-400 dark:bg-slate-800
              h-[20vh] w-screen overflow-hidden z-30 transition-all duration-200 ease-out ${isClosing? "animate-fallup":"animate-falldown"}`}
          >
            <nav className="flex flex-col text-left px-6 h-[50vh] text-xl gap-2">
              {auth?.userId ? (
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive
                      ? "text-rose-900 dark:text-rose-400 w-fit px-2 py-2 flex items-center font-extrabold transition duration-300 ease-in-out"
                      : "text-rose-100 dark:text-slate-200 w-fit px-2 py-2 flex items-center hover:text-rose-250 dark:hover:text-slate-300 font-bold transition duration-300 ease-in-out"
                  }
                  onClick={() => {
                    setIsClosing(true);
                    setTimeout(() => {
                      setIsOpen(false);
                      setIsClosing(false);
                    }, 500);
                  }}
                >
                  {t("header.myurls")}
                </NavLink>
              ) : (
                <NavLink
                  to="/registration"
                  className={({ isActive }) =>
                    isActive
                      ? "text-rose-900 dark:text-rose-400 w-fit px-2 py-2 flex items-center font-extrabold transition duration-100 ease-in-out"
                      : "text-rose-100 dark:text-slate-200 w-fit px-2 py-2 flex items-center hover:text-rose-250 dark:hover:text-slate-300 font-bold transition duration-100 ease-in-out"
                  }
                  onClick={() => {
                    setIsClosing(true);
                    setTimeout(() => {
                      setIsOpen(false);
                      setIsClosing(false);
                    }, 500);
                  }}
                >
                  {t("header.signup")}
                </NavLink>
              )}
              <div className="mt-4">
                <LangDropdown />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
export default Header_bar;


