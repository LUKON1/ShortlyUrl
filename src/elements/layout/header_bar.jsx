import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import LangDropdown from "../shared/lang_dropdown";
import ThemeToggle from "../shared/theme_toggle";
import useAuth from "../../utils/useAuth";

function Header_bar() {
  const { t } = useTranslation();
  const { auth } = useAuth();
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
      className="header relative flex h-20 w-full min-w-2xs flex-row items-center bg-slate-900 shadow-lg transition-colors duration-200 dark:bg-slate-800"
      style={{ transition: "var(--transition-bg)" }}
    >
      <div className="flex h-full w-full flex-row items-center justify-between px-6 transition-all duration-200 ease-out lg:px-20">
        <div className="">
          <Link to="/" className="group flex items-center gap-3">
            <img
              onDragStart={(e) => e.preventDefault()}
              className="relative h-14 w-14 transition-transform duration-200 select-none group-hover:scale-110"
              src="/src/assets/home-page.png"
              alt="home"
            />
            <span className="text-xl font-bold text-white lg:text-2xl dark:text-slate-100">
              ShortlyURL
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-lg transition-all duration-200 ease-out md:flex md:flex-row md:text-xl">
          <ThemeToggle />
          <LangDropdown />
          {auth?.userId ? (
            <NavLink
              to="/profile"
              style={{ transition: "var(--transition-bg)" }}
              className={({ isActive }) =>
                isActive
                  ? "rounded-lg bg-slate-800 px-4 py-2 font-extrabold text-blue-400 transition duration-300 ease-in-out dark:bg-slate-700 dark:text-blue-300"
                  : "rounded-lg px-4 py-2 font-bold text-slate-300 transition duration-300 ease-in-out hover:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }
            >
              {t("header.myurls")}
            </NavLink>
          ) : (
            <NavLink
              to="/registration"
              style={{ transition: "var(--transition-bg)" }}
              className={({ isActive }) =>
                isActive
                  ? "rounded-lg bg-slate-800 px-4 py-2 font-bold text-blue-400 dark:bg-slate-700 dark:text-blue-300"
                  : "rounded-lg px-4 py-2 font-bold text-slate-300 hover:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }
            >
              {t("header.signup")}
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button onClick={handleToggle} type="button" className="touch-manipulation">
            {!isOpen ? (
              <img
                src="/src/assets/burger.svg"
                onDragStart={(e) => e.preventDefault()}
                className="h-14 w-14 select-none dark:invert"
                alt="меню"
              />
            ) : (
              <>
                <img
                  src="/src/assets/burger-cross.svg"
                  onDragStart={(e) => e.preventDefault()}
                  className="relative z-40 h-14 w-14 select-none dark:invert"
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
            className={`absolute top-20 left-0 z-30 h-[20vh] w-screen overflow-hidden bg-slate-900 transition-all duration-200 ease-out dark:bg-slate-800 ${isClosing ? "animate-fallup" : "animate-falldown"}`}
            style={{ transition: "var(--transition-bg)" }}
          >
            <nav className="flex h-[50vh] flex-col gap-2 px-6 text-left text-xl">
              {auth?.userId ? (
                <NavLink
                  to="/profile"
                  style={{ transition: "var(--transition-bg)" }}
                  className={({ isActive }) =>
                    isActive
                      ? "flex w-fit items-center px-2 py-2 font-extrabold text-blue-400 transition duration-300 ease-in-out dark:text-blue-300"
                      : "flex w-fit items-center px-2 py-2 font-bold text-slate-300 transition duration-300 ease-in-out hover:text-white dark:text-slate-200 dark:hover:text-slate-300"
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
                  style={{ transition: "var(--transition-bg)" }}
                  className={({ isActive }) =>
                    isActive
                      ? "flex w-fit items-center px-2 py-2 font-extrabold text-blue-400 transition duration-100 ease-in-out dark:text-blue-300"
                      : "flex w-fit items-center px-2 py-2 font-bold text-slate-300 transition duration-100 ease-in-out hover:text-white dark:text-slate-200 dark:hover:text-slate-300"
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
