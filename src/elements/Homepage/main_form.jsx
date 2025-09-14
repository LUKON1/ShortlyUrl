// main_form.jsx - Основная форма для сокращения URL. | Main form for URL shortening.
import { useState, useEffect, useRef, useCallback } from "react"; // Хуки React для состояния, эффектов, ссылок и мемоизации функций. | React hooks for state, effects, refs, and function memoization.
import CopyButton from "./copy_button.jsx"; // Компонент кнопки "Копировать". | Copy button component.
import SubmitButton from "./submit_button.jsx"; // Компонент кнопки "Отправить". | Submit button component.
import Qrgen from "./qr_gen.jsx"; // Компонент для генерации QR-кода. | QR code generation component.
import LoadQR_Button from "./loadQR_Button.jsx"; // Компонент кнопки для загрузки QR-кода. | QR code download button component.
import Notifications from "../messagewindow.jsx"; // Компонент для отображения уведомлений. | Notification display component.
import { useTranslation } from "react-i18next"; // Хук для интернационализации. | Hook for internationalization.

function ShortenerForm() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const {t} = useTranslation() // Инициализация хука перевода. | Initialize translation hook.

  // --- Управление состоянием формы и результатами | Form state and results management ---
  const [url, setUrl] = useState(""); 
  const [shortUrl, setShortUrl] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 

  // --- Ссылки на DOM-элементы и компоненты | Refs to DOM elements and components ---
  const notificationRef = useRef(); 
  const qrContainerRef = useRef(null);
  const inputRef = useRef(); 

  // --- Опции для URL (время жизни) и их перевод | URL options (lifetime) and their translation ---
  const [urlTime, setUrlTime] = useState("");
  const urlTimeOptions = [
    { value: 604800, label: t('homepage.urlopt.urtime.week')},
    { value: 86400, label: t('homepage.urlopt.urtime.day') },
    { value: 3600, label: t('homepage.urlopt.urtime.hour') },
    { value: 2592000, label: t('homepage.urlopt.urtime.month') },
  ];
 
  // --- Фокусировка на поле ввода при монтировании компонента | Focus input field on component mount ---
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // --- Обработчик отправки формы | Form submission handler ---
  const handleSubmit = useCallback(async (e) => {
      e.preventDefault(); // Предотвращает перезагрузку страницы. | Prevents page reload.
      
      // Валидация: проверка на пустой URL. | Validation: check for empty URL.
      if (!url) {
        notificationRef.current?.addNotification(t('message.urlblank'), 3000);
        return;
      }

      // Валидация: проверка на совпадение домена с текущим. | Validation: check for matching domain with current one.
      const containsMyDomain = (url) => {
        const MyDomainHost = window.location.host;
        const MyDomainName = window.location.hostname;
        const banedDomains = ["localhost:7206", MyDomainName , MyDomainHost ];
        const regexp = new RegExp(
          `^(https?:\/\/)?(www\.)?(${banedDomains.join("|")})(\/|$)`,
          "i"
        );
        return regexp.test(url);
      };

      try {
        if (containsMyDomain(url)) {
          throw new Error(); // Генерирует ошибку, если URL совпадает с доменом приложения. | Throws an error if URL matches the application's domain.
        }
        setIsLoading(true); // Устанавливает состояние загрузки. | Sets loading state.
       
        // Отправка запроса на сокращение URL к API. | Sending URL shortening request to the API.
        const response = await fetch(`${API_BASE_URL}/ShortUrl/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Отправка URL, времени жизни, количества кликов и токена пользователя. | Sending URL, lifetime, click count, and user token.
          body: JSON.stringify({url:url, urlTime:urlTime}) 
        });
        
        if (!response.ok) {
          throw new Error("Response error"); // Обработка ошибок HTTP-ответа. | Handle HTTP response errors.
        }
        console.log(`http status:  ${response.status}`);
        
        const usercode = await response.text(); // Получение сокращенного кода. | Get the shortened code.
        if (usercode.length !== 7) {
          throw new Error(); // Проверка длины кода. | Code length check.
        }
        
        const shortUrl = `${API_BASE_URL}/ShortUrl/${usercode}`; // Формирование полного сокращенного URL. | Construct the full shortened URL.
        setShortUrl(shortUrl); // Обновление состояния сокращенного URL. | Update the shortened URL state.

      } catch (error) {
        // Отображение уведомления об ошибке. | Display error notification.
        notificationRef.current?.addNotification(
          t('message.urlcuterror'),
          3000
        );
      } finally {
        setIsLoading(false); // Сброс состояния загрузки. | Reset loading state.
      }
    },
    [urlTime, url] // Зависимости `useCallback`. | `useCallback` dependencies.
  );

  // --- Рендеринг компонента | Component rendering ---
  return (
    <div>
      <Notifications ref={notificationRef} /> {/* Компонент для вывода всплывающих уведомлений. | Component for displaying pop-up notifications. */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col transition-all duration-200 ease-out"
      >
        <div className="flex flex-col items-center md:flex-row md:gap-6 mb-6 md:mb-18 gap-40">
          <div className="felx flex-col relative">
            {/* Кнопка очистки поля ввода URL. | URL input clear button. */}
            {url && (
              <button className="absolute" onClick={() => setUrl("")}>
                <img
                  className="w-8 h-full hover:cursor-pointer lg:w-10"
                  src="/src/assets/cross.svg"
                  alt="X"
                />
              </button>
            )}
            {/* Поле ввода длинного URL. | Long URL input field. */}
            <input
              ref={inputRef}
              className=" transition-all duration-200 ease-out text-center p-2 h-16 lg:h-20  text-1xl md:text-2xl lg:text-3xl border-1 rounded-md max-w-5xl border-sky-400 w-3xs md:w-[55vw] lg:w-[70vw]"
              type="url"
              value={url}
              onChange={(e) => {
                const url = e?.target.value;
                setUrl(url);
              }}
              placeholder= {t('homepage.placeholder')}
            />
            {/* Блок выбора опций времени жизни и кликов URL. | Block for selecting URL lifetime and click options. */}
            <div
              className="absolute flex md:flex-row flex-col gap-x-2.5 lg:gap-x-10 gap-y-6 w-full mt-2.5 bg-rose-50 border border-sky-400  focus:outline-none  py-2 px-1 rounded justify-center text-xs md:text-lg lg:text-2xl"
            >
              {/* Выбор времени жизни URL. | URL lifetime selection. */}
              <div className="flex flex-row md:gap-2  justify-between md:justify-normal">
                <p>{t('homepage.urlopt.urtime.liftimeword')}</p>
                <select
                  className="w-30 lg:w-35 text-center md:w-20"
                  value={urlTime}
                  onChange={(e) => {
                    setUrlTime(Number(e?.target.value));
                  }}
                >
                  {urlTimeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <SubmitButton isLoading={isLoading} /> {/* Кнопка отправки формы. | Form submit button. */}
        </div>
        
        {/* Блок отображения сокращенного URL и QR-кода (появляется после успешного сокращения). | Block for displaying shortened URL and QR code (appears after successful shortening). */}
        {shortUrl && (
          <div className=" flex flex-col items-center mb-60">
            <div className="mb-30 flex flex-col items-center md:flex-row gap-5 md:gap-6 justify-center">
              {/* Отображение сокращенного URL. | Display of the shortened URL. */}
              <div
                className="transition-all duration-200 ease-out flex flex-col items-center justify-center overflow-hidden text-center h-16 p-2 box-border border-1 rounded-md lg:h-20  text-1xl md:text-2xl lg:text-3xl  max-w-5xl border-sky-400 w-3xs md:w-[55vw] lg:w-[70vw]"
              >
              <span className="select-all">{shortUrl}</span>
              </div>
              <div className="transition-all duration-200 ease-out ">
                <CopyButton shortUrl={shortUrl} /> {/* Кнопка для копирования сокращенного URL. | Button to copy the shortened URL. */}
              </div>
            </div>
            <div className="transition-all duration-200 ease-out flex flex-col md:flex-col-reverse md:gap-8 gap-5">
              <Qrgen
                ShortUrl={shortUrl}
                qrContainerRef={qrContainerRef}
                notificationRef={notificationRef}
              /> {/* Компонент для генерации и отображения QR-кода. | Component for generating and displaying the QR code. */}
              <LoadQR_Button
                qrContainerRef={qrContainerRef}
                notificationRef={notificationRef}
                url={url}
              /> {/* Кнопка для загрузки QR-кода. | Button to download the QR code. */}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
export default ShortenerForm;


