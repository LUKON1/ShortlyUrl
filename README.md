# ShortURL - Cервис сокращения ссылок и управления ими

## О проекте

**ShortURL** — это сервис для эффективного сокращения длинных URL-адресов и расширенного управления ими. Проект создан с использованием React и демонстрирует передовые подходы к разработке веб-приложений. Наша цель — не просто сокращать ссылки, но и предоставлять ценные инструменты для их отслеживания и анализа, особенно актуальные для RU-сегмента рынка, где подобные решения для бизнеса пока ограничены.

## Возможности

- **Сокращение URL:** Мгновенное преобразование длинных и неудобных ссылок в короткие, удобные для обмена.
- **Гибкие настройки URL:** Возможность устанавливать срок жизни кликов для каждой сокращенной ссылки, предоставляя контроль над распространением контента.
- **Генерация динамических QR-кодов:** Автоматическое создание уникальных QR-кодов для каждой сокращенной ссылки с возможностью скачивания для удобного распространения в офлайн-среде.
- **Аутентификация и Управление Пользователями:** Надежная система регистрации и авторизации, обеспечивающая доступ к персональным функциям и защищенным маршрутам для зарегистрированных пользователей.
- **Персональный Кабинет:** Просмотр, копирование и полное управление всеми сокращенными ссылками в удобном интерфейсе для авторизованных пользователей.
- **Аналитика и Статистика:** Cтатистика по кликам, графики производительности ссылок, топ-ссылки и пользовательская аналитика для отслеживания эффективности.
- **Темная тема:** Поддержка светлой и темной темы интерфейса для комфортного использования в различных условиях освещения.
- **Мультиязычность (i18n):** Интерфейс с поддержкой нескольких языков (русский и английский) для максимального удобства глобальной аудитории.
- **Адаптивный дизайн:** Оптимизированный пользовательский интерфейс, который прекрасно выглядит и функционирует на любых устройствах: от мобильных телефонов до десктопов, благодаря Tailwind CSS.
- **Совместное использование:** Возможность делиться сокращенными ссылками с другими пользователями через специальные страницы.
- **Управление профилем:** Функции редактирования профиля, удаления аккаунта и просмотра статистики пользователя.

## Технологии

- **Frontend:**
  - [React](https://react.dev/) (v19.1.0) - Библиотека для создания пользовательских интерфейсов.
  - [Vite](https://vitejs.dev/) (v7.0.4) - Инструмент для быстрой сборки и разработки.
  - [React Router DOM](https://reactrouter.com/web/guides/quick-start) (v7.8.0) - Для маршрутизации в приложении.
  - [Tailwind CSS](https://tailwindcss.com/) (v4.1.14) - CSS-фреймворк для быстрого стилизования.
  - [i18next & react-i18next](https://react.i18next.com/) (v25.3.4, v15.6.1) - Для международной локализации.
  - [qrcode.react](https://www.npmjs.com/package/qrcode.react) (v4.2.0) - Для генерации QR-кодов.
  - [Motion](https://motion.dev/) (v12.23.26) - Библиотека для анимаций.
  - [Recharts](https://recharts.org/) (v3.3.0) - Библиотека для построения графиков.
  - [Axios](https://axios-http.com/) (v1.12.2) - HTTP клиент.
  - [Day.js](https://day.js.org/) (v1.11.18) - Легковесная альтернатива Moment.js.
- **Backend:**
  - [Node.js](https://nodejs.org/) - Среда выполнения JavaScript для создания масштабируемых сетевых приложений.
  - [Express.js](https://expressjs.com/) (v5.1.0) - Минималистичный и гибкий фреймворк для веб-приложений Node.js.
  - [MongoDB + Mongoose](https://www.mongodb.com/) (v8.18.1) - Популярная документо-ориентированная база данных NoSQL.
  - [JWT](https://jwt.io/) (v9.0.2) - Для аутентификации.
  - [bcrypt](https://www.npmjs.com/package/bcrypt) (v6.0.0) - Для хеширования паролей.
  - [QRCode](https://www.npmjs.com/package/qrcode) (v1.5.4) - Для генерации QR-кодов на сервере.
- **Testing and Development:**
  - [Mock Service Worker (MSW)](https://mswjs.io/) (v2.10.5) - Для мокирования API в браузере.
  - [Vitest](https://vitest.dev/) (v3.2.4) - Фреймворк для тестирования.
  - [ESLint](https://eslint.org/) (v9.30.1) - Для линтинга кода.
  - [Prettier](https://prettier.io/) (v3.6.2) - Для форматирования кода.

## Установка и Запуск

### Требования

- Node.js (рекомендуется v18+)
- MongoDB (локально или облако, например MongoDB Atlas)
- npm или yarn

### Установка

1. **Клонируйте репозиторий:**

   ```bash
   git clone https://github.com/LUKON1/ShrotlyUrl.git
   cd ShrotlyUrl
   ```

2. **Установите зависимости клиента:**

   ```bash
   npm install
   ```

3. **Установите зависимости сервера:**

   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Настройте переменные окружения:**
   - **Клиент (.env):**

     ```env
     VITE_API_BASE_URL=http://localhost:3000/api
     VITE_BASE_URL=http://localhost:5173
     VITE_MSW_ACTIVE="FALSE"
     ```

   - **Сервер (server/.env):**
     ```env
     PORT=3000
     DB_URI=your_mongodb_connection_string
     HOST_NAME=http://localhost:5173
     JWT_SECRET=your_jwt_secret_key
     JWT_REFRESH_SECRET=another_jwt_secret_key
     ```

### Запуск

1. **Запуск сервера:**

   ```bash
   cd server
   npm run dev
   ```

2. **Запуск клиента (в новом терминале):**

   ```bash
   npm run dev
   ```

3. **Открыть приложение:**
   Перейдите по адресу `http://localhost:5173`

## Структура проекта

```
ShrotlyUrl
├─ .prettierrc
├─ LICENSE
├─ README.md
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ mockServiceWorker.js
├─ server
│  ├─ index.js
│  ├─ middleware
│  │  └─ auth.js
│  ├─ models
│  │  ├─ Url.js
│  │  └─ User.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ cut.js
│  │  ├─ myurls.js
│  │  ├─ redirect.js
│  │  ├─ share.js
│  │  └─ user.js
│  ├─ testgen.js
│  └─ utils
│     └─ shortcodegen.js
├─ src
│  ├─ api
│  │  └─ axios.js
│  ├─ assets
│  │  ├─ burger-cross.svg
│  │  ├─ burger.svg
│  │  ├─ cross.svg
│  │  ├─ home-page.png
│  │  └─ reload.svg
│  ├─ context
│  │  ├─ AuthProvider.jsx
│  │  ├─ OfflineProvider.jsx
│  │  └─ ThemeProvider.jsx
│  ├─ elements
│  │  ├─ App.jsx
│  │  ├─ Dashboard
│  │  │  ├─ ProfileAnalyticsChart.jsx
│  │  │  ├─ StatsCard.jsx
│  │  │  ├─ TopUrlsList.jsx
│  │  │  ├─ UrlAnalyticsChart.jsx
│  │  │  ├─ UserProfile.jsx
│  │  │  ├─ deleteProfile.jsx
│  │  │  ├─ logout.jsx
│  │  │  └─ myurlslist.jsx
│  │  ├─ Homepage
│  │  │  ├─ copy_button.jsx
│  │  │  ├─ loadQR_Button.jsx
│  │  │  ├─ main_form.jsx
│  │  │  ├─ qr_gen.jsx
│  │  │  ├─ submit_button.jsx
│  │  │  └─ time_dropdown.jsx
│  │  ├─ Pages
│  │  │  ├─ !Homepage.jsx
│  │  │  ├─ !Myurlspage.jsx
│  │  │  ├─ !Registrpage.jsx
│  │  │  ├─ !Signinpage.jsx
│  │  │  ├─ ExpiredPage.jsx
│  │  │  ├─ PausedPage.jsx
│  │  │  ├─ PrivateRoute.jsx
│  │  │  └─ SharePage.jsx
│  │  ├─ PrivacyPolicyPage.jsx
│  │  ├─ Registration
│  │  │  ├─ registr_form.jsx
│  │  │  └─ signin_form.jsx
│  │  ├─ layout
│  │  │  ├─ footer.jsx
│  │  │  └─ header_bar.jsx
│  │  └─ shared
│  │     ├─ AppLoader.jsx
│  │     ├─ ConfirmModal.jsx
│  │     ├─ HiddenSVGIcons.jsx
│  │     ├─ OfflineModal.jsx
│  │     ├─ UrlCard.jsx
│  │     ├─ h1.jsx
│  │     ├─ lang_checkbox.jsx
│  │     ├─ lang_dropdown.jsx
│  │     ├─ messagewindow.jsx
│  │     ├─ registr_submit.jsx
│  │     ├─ theme_toggle.jsx
│  │     └─ wrapper_home.jsx
│  ├─ fonts
│  │  └─ amazdoomleft.ttf
│  ├─ main.jsx
│  ├─ mocks
│  │  ├─ browser.js
│  │  └─ handlers.js
│  ├─ style.css
│  ├─ translation
│  │  ├─ i18n.js
│  │  └─ languages
│  │     ├─ en_lang.json
│  │     └─ ru_lang.json
│  └─ utils
│     ├─ clientRoutes.js
│     ├─ containsMyDomain.js
│     ├─ formatDate.js
│     ├─ loginvalidate.js
│     ├─ retryRequest.js
│     ├─ useAuth.js
│     ├─ useAuthOnLoading.js
│     ├─ useAxiosPrivate.js
│     └─ useRefreshToken.js
└─ vite.config.js

```
