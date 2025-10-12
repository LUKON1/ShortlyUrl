import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import LangCheckBox from "../shared/lang_checkbox";
import useAuth from "../../utils/useAuth";

function Header_bar() {
  const { t } = useTranslation();
  const {auth} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleToggle = () => {
    if (isOpen) {
      // Закрываем с анимацией
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 500);
    } else {
      // Открываем
      setIsOpen(true);
      setIsClosing(false);
    }
  };
  const fallAnimation = `
    @keyframes fallDown {
          from { height: 0vh; }
          to {height : 50vh; }
    }
    @keyframes fallUp {
    from { height: 50vh; }
    to {  height: 0vh; }
  }
  `;

  return (
    <header
      className="header min-w-2xs mb-20 md:mb-30 lg:mb-40 flex
         flex-row w-full h-20 relative bg-rose-400 items-center"
    >
      <div
        className="flex flex-row w-full h-full items-center
       justify-between ml-[10vw] mr-[2vw] lg:ml-[20vw] transition-all duration-200 ease-out"
      >
        <div className="">
          <Link to="/">
            <img
              onDragStart={(e) => e.preventDefault()}
              className="select-none h-14 w-14 relative"
              src="/src/assets/home-page.png"
              alt="home"
            />
          </Link>
        </div>

        <nav
          className="md:flex md:flex-row w-[50vw] text-center  justify-center items-center hidden text-lg md:text-xl lg:text-2xl
         text-rose-50 font-bold transition-all duration-200 ease-out h-2/3"
        >
          <LangCheckBox />
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-rose-900 h-full flex justify-center items-center grow basis-1/5  font-extrabold transition duration-300 ease-in-out delay-100"
                : "text-rose-100 h-full flex justify-center items-center hover:text-rose-250  grow basis-1/5 font-bold transition duration-300 ease-in-out delay-100 hover:-translate-y-2"
            }
          >
            {t("header.about")}
          </NavLink>
          {auth?.user ? (
            <NavLink
              to="/myurls"
              className={({ isActive }) =>
                isActive
                  ? "text-rose-900 h-full flex justify-center items-center grow basis-1/5 font-extrabold transition duration-300 ease-in-out delay-100"
                  : "text-rose-100 h-full flex justify-center items-center hover:text-rose-250 grow basis-1/5 font-bold transition duration-300 ease-in-out delay-100 hover:-translate-y-2"
              }
            >
              {t("header.myurls")}
            </NavLink>
          ) : (
            <NavLink
              to="/registration"
              className={({ isActive }) =>
                isActive
                  ? "text-rose-900 h-full flex justify-center items-center grow basis-1/5 font-extrabold transition duration-300 ease-in-out delay-100"
                  : "text-rose-100 h-full flex justify-center items-center hover:text-rose-250 grow basis-1/5 font-bold transition duration-300 ease-in-out delay-100 hover:-translate-y-2"
              }
            >
              {t("header.signup")}
            </NavLink>
          )}
        </nav>
        <div className="md:hidden">
          <button onClick={handleToggle} type="button">
            {!isOpen ? (
              <img
                src="/src/assets/burger.svg"
                onDragStart={(e) => e.preventDefault()}
                className="select-none h-14 w-14 "
                alt="меню"
              />
            ) : (
              <>
                <img
                  src="/src/assets/burger-cross.svg"
                  onDragStart={(e) => e.preventDefault()}
                  className="select-none h-14 w-14 relative z-40"
                  alt="меню"
                />
              </>
            )}
          </button>
        </div>
      </div>
      {(isOpen || isClosing) && (
        <div className="md:hidden">
          <style>{fallAnimation}</style>
          <div
            className="absolute top-20 left-0 bg-rose-400
              h-[20vh] w-screen overflow-hidden z-30 transition-all duration-200 ease-out "
            style={{
              animation: isClosing
                ? "fallUp 0.5s ease-out forwards"
                : "fallDown 0.3s ease-out  forwards",
            }}
          >
            <nav className="flex flex-col text-left ml-[10vw]  h-[50vh] text-xl ">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-rose-900 basis-1/4 w-fit px-2 flex items-center font-extrabold transition duration-300 ease-in-out delay-100"
                    : "text-rose-100 basis-1/4 w-fit px-2 flex items-center hover:text-rose-250  font-bold transition duration-300 ease-in-out delay-100 hover:-translate-y-2"
                }
                onClick={() => {
                  setIsClosing(true);
                  setTimeout(() => {
                    setIsOpen(false);
                    setIsClosing(false);
                  }, 500);
                }}
              >
                {t("header.about")}
              </NavLink>
              {auth?.user ? (
                <NavLink
                  to="/myurls"
                  className={({ isActive }) =>
                    isActive
                      ? "text-rose-900 basis-1/4 w-fit px-2 flex items-center font-extrabold transition duration-300 ease-in-out delay-100"
                      : "text-rose-100 basis-1/4 w-fit px-2 flex items-center hover:text-rose-250  font-bold transition duration-300 ease-in-out delay-100 hover:-translate-y-2"
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
                      ? "text-rose-900 basis-1/4 w-fit px-2 flex items-center font-extrabold transition duration-100 ease-in-out "
                      : "text-rose-100 basis-1/4 w-fit px-2 flex items-center hover:text-rose-250  font-bold transition duration-100 ease-in-out  hover:-translate-y-2"
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
              <LangCheckBox />
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
export default Header_bar;
