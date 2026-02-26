import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { CLIENT_ROUTES } from "../../utils/clientRoutes.js";

// Feature section data
const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
    title: "Сокращение ссылок",
    description:
      "Введите длинный URL — сервис мгновенно создаёт короткий код из 7 символов. Короткая ссылка сразу доступна для копирования, вставки в любой канал коммуникации или распечатки на материалах.",
    details: [
      "Автоматическая генерация уникального 7-символьного кода",
      "Мгновенное копирование в буфер обмена одним кликом",
      "Поддержка любых HTTPS и HTTP ссылок",
      "Защита от сокращения ссылок на собственный домен сервиса",
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
    title: "Кастомные алиасы",
    description:
      "Вместо случайного кода задайте понятное имя ссылки. Это особенно полезно для маркетинговых кампаний, внутренних регламентов и QR-кодов на печатных материалах.",
    details: [
      "Поддержка букв, цифр, дефисов и подчёркиваний",
      "Длина от 4 до 30 символов",
      "Проверка уникальности — дублей не будет",
      "Примеры: /spring-sale, /onboarding, /price-list",
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
    title: "UTM-конструктор",
    description:
      "Встроенный конструктор UTM-меток позволяет добавить параметры отслеживания прямо в форме создания ссылки. Все метки автоматически встраиваются в целевой URL до сохранения.",
    details: [
      "utm_source — источник трафика (google, telegram, email...)",
      "utm_medium — канал (cpc, organic, banner, email...)",
      "utm_campaign — название кампании",
      "utm_term — ключевое слово (для платного поиска)",
      "utm_content — вариант объявления (A/B тест)",
      "Сохранённые метки отображаются в карточке ссылки",
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
        />
      </svg>
    ),
    title: "QR-коды",
    description:
      "При создании каждой ссылки автоматически генерируется QR-код высокого качества. Его можно скачать в PNG и использовать в презентациях, раздаточных материалах, вывесках и упаковке.",
    details: [
      "Автоматическая генерация при создании ссылки",
      "Скачивание в PNG одним кликом",
      "Высокое разрешение 256×256 px, уровень коррекции M",
      "QR ведёт на короткую ссылку — не на оригинальный URL",
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Время жизни ссылки",
    description:
      "Каждая ссылка имеет настраиваемый срок действия. По истечении срока ссылка деактивируется и перестаёт работать — пользователь видит страницу с уведомлением.",
    details: [
      "Пресеты: час, день, неделя, месяц",
      "Произвольный срок в секундах",
      "Автоматическая очистка по расписанию (cron job)",
      "Просроченные ссылки редиректят на /exp",
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Аналитика переходов",
    description:
      "По каждой ссылке собирается детальная статистика кликов. Данные агрегируются ежедневно и доступны в профиле пользователя и на share-странице.",
    details: [
      "Общее количество переходов",
      "Разбивка по типу устройства: десктоп / мобильный / планшет",
      "Разбивка по браузеру: Chrome, Safari, Firefox и др.",
      "Разбивка по стране и городу (GeoIP)",
      "Разбивка по источнику (referrer или User-Agent для мессенджеров)",
      "Графики по дням",
      "Фильтрация ботов и краулеров",
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
    ),
    title: "Share-страница",
    description:
      "Каждая ссылка имеет публичную share-страницу, на которой отображается статистика и информация. Её можно передавать команде или руководству без доступа к аккаунту.",
    details: [
      "Публичный URL вида /share/:id",
      "Отображение оригинального URL, UTM-меток и статистики",
      "Кнопка перехода на целевой сайт",
      "Доступна без авторизации",
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    ),
    title: "Панель управления",
    description:
      "Авторизованный пользователь видит все свои ссылки в едином списке. Каждую ссылку можно редактировать, ставить на паузу или удалять прямо из интерфейса.",
    details: [
      "Список всех ссылок с поиском и сортировкой",
      "Редактирование оригинального URL и UTM-меток",
      "Пауза ссылки (редиректит на /pau) без удаления",
      "Добавление названия для ссылки для удобной навигации",
      "Отображение статистики по каждой ссылке",
    ],
  },
];

const FeaturesPage = () => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="motion-safe mb-12 text-center"
      >
        <h1 className="mb-4 text-4xl font-extrabold text-slate-800 dark:text-slate-100">
          Функционал и использование
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          Подробное описание всех возможностей ShortlyURL
        </p>
      </motion.div>

      {/* Feature cards */}
      <div className="flex flex-col gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="motion-safe rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
          >
            {/* Title row */}
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400">
                {feature.icon}
              </span>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {feature.title}
              </h2>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {feature.description}
            </p>

            {/* Details list */}
            <ul className="space-y-1.5">
              {feature.details.map((detail) => (
                <li
                  key={detail}
                  className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-sky-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Self-Hosted Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="motion-safe mt-12 mb-4 rounded-xl border border-sky-200 bg-sky-50 p-8 text-center shadow-sm dark:border-sky-800/60 dark:bg-sky-900/20"
      >
        <h2 className="mb-3 text-2xl font-bold text-slate-800 dark:text-slate-100">
          Open Source и Self-Hosted
        </h2>
        <p className="mx-auto mb-6 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Для корпоративных клиентов и команд, заботящихся о приватности: проект имеет открытый
          исходный код. Вы можете развернуть собственную копию ShortlyURL на своих серверах
          (Self-Hosted), чтобы вся агрегированная статистика по кликам и UTM-кампаниям оставалась
          строго внутри вашей закрытой инфраструктуры, без передачи сторонним сервисам.
        </p>
        <a
          href="https://github.com/LUKON1/ShortlyUrl/tree/self-host-edition"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .08 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
            />
          </svg>
          Смотреть Self-Hosted версию
        </a>
      </motion.div>

      {/* Back link */}
      <div className="mt-10 text-center">
        <Link
          to={CLIENT_ROUTES.HOME}
          className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-5 py-2.5 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-100 dark:border-sky-800/60 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:bg-sky-900/50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          На главную
        </Link>
      </div>
    </div>
  );
};

export default FeaturesPage;
