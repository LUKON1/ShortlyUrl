import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import LangDropdown from "../shared/lang_dropdown";
import ThemeToggle from "../shared/theme_toggle";
import useAuth from "../../utils/useAuth";
import { CLIENT_ROUTES } from "../../utils/clientRoutes.js";
import logo from "../../assets/favicon.svg";

function Header_bar() {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header
        className="header relative flex h-20 w-full min-w-2xs flex-row items-center bg-slate-900 shadow-lg transition-colors duration-200 dark:bg-slate-800"
        style={{ transition: "var(--transition-bg)", zIndex: 50 }}
      >
        <div className="flex h-full w-full flex-row items-center justify-between px-6 transition-all duration-200 ease-out lg:px-20">
          <div className="">
            <Link
              to={CLIENT_ROUTES.HOME}
              className="group flex items-center gap-3"
              style={{ zIndex: 60 }}
            >
              <img
                onDragStart={(e) => e.preventDefault()}
                className="relative h-12 w-12 transition-transform duration-200 select-none group-hover:scale-110"
                src={logo}
                alt="home"
                style={{ zIndex: 60 }}
              />
              <span
                className="text-xl font-bold text-white lg:text-2xl dark:text-slate-100"
                style={{ zIndex: 60 }}
              >
                ShortlyURL
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 text-lg transition-all duration-200 ease-out md:flex md:flex-row md:text-xl">
            <ThemeToggle />
            <LangDropdown />
            {auth?.userId ? (
              <NavLink
                to={CLIENT_ROUTES.PROFILE}
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
                to={CLIENT_ROUTES.REGISTRATION}
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
            <button
              onClick={handleToggle}
              type="button"
              className="touch-manipulation"
              style={{ zIndex: 60 }}
            >
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
      </header>
      <div className="md:hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              className="absolute top-20 left-0 w-screen bg-slate-900 dark:bg-slate-800"
              style={{ transition: "var(--transition-bg)", zIndex: 40 }}
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <nav className="flex flex-col gap-2 px-6 py-4 text-left text-xl">
                {auth?.userId ? (
                  <NavLink
                    to={CLIENT_ROUTES.PROFILE}
                    style={{ transition: "var(--transition-bg)" }}
                    className={({ isActive }) =>
                      isActive
                        ? "flex w-fit items-center px-2 py-2 font-extrabold text-blue-400 transition duration-300 ease-in-out dark:text-blue-300"
                        : "flex w-fit items-center px-2 py-2 font-bold text-slate-300 transition duration-300 ease-in-out hover:text-white dark:text-slate-200 dark:hover:text-slate-300"
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {t("header.myurls")}
                  </NavLink>
                ) : (
                  <NavLink
                    to={CLIENT_ROUTES.REGISTRATION}
                    style={{ transition: "var(--transition-bg)" }}
                    className={({ isActive }) =>
                      isActive
                        ? "flex w-fit items-center px-2 py-2 font-extrabold text-blue-400 transition duration-100 ease-in-out dark:text-blue-300"
                        : "flex w-fit items-center px-2 py-2 font-bold text-slate-300 transition duration-100 ease-in-out hover:text-white dark:text-slate-200 dark:hover:text-slate-300"
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {t("header.signup")}
                  </NavLink>
                )}
                <div className="mt-4 mb-4">
                  <LangDropdown />
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
export default Header_bar;
