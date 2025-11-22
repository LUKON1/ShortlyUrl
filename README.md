# ShortURL - Мощный сервис сокращения ссылок и управления ими | ShortURL - Powerful URL Shortening and Management Service

## О проекте || About the Project

**ShortURL** — это сервис для эффективного сокращения длинных URL-адресов и расширенного управления ими. Проект создан с использованием React и демонстрирует передовые подходы к разработке веб-приложений. Наша цель — не просто сокращать ссылки, но и предоставлять ценные инструменты для их отслеживания и анализа, особенно актуальные для RU-сегмента рынка, где подобные решения для бизнеса пока ограничены.

**ShortURL** is a service for efficient URL shortening and advanced link management. The project is built with React, showcasing advanced web application development approaches. Our goal is not just to shorten links, but to provide valuable tools for tracking and analyzing them, particularly relevant for the Russian market where similar business solutions are currently limited.

## Возможности || Features

- **Сокращение URL | URL Shortening:** Мгновенное преобразование длинных и неудобных ссылок в короткие, удобные для обмена. | Instantly transform long, unwieldy links into short, shareable ones.
- **Гибкие настройки URL | Flexible URL Settings:** Возможность устанавливать срок жизни кликов для каждой сокращенной ссылки, предоставляя контроль над распространением контента. | Ability to set a lifetime and click limit for each shortened link, providing control over content distribution.
- **Генерация QR-кодов | QR Code Generation:** Автоматическое создание уникальных QR-кодов для каждой сокращенной ссылки с возможностью скачивания для удобного распространения в офлайн-среде. | Automatically generate unique QR codes for each shortened link, with download capability for easy offline distribution.
- **Аутентификация и Управление Пользователями | Authentication and User Management:** Надежная система регистрации и авторизации, обеспечивающая доступ к персональным функциям и защищенным маршрутам для зарегистрированных пользователей. | Robust registration and authorization system, providing access to personal features and protected routes for registered users.
- **Персональный Кабинет | Personal Dashboard:** Просмотр, копирование и полное управление всеми сокращенными ссылками в удобном интерфейсе для авторизованных пользователей. | View, copy, and fully manage all shortened links through a user-friendly interface for authorized users.
- **Мультиязычность (i18n) | Multilingual Support (i18n):** Интерфейс с поддержкой нескольких языков (русский и английский) для максимального удобства глобальной аудитории. | Multilingual interface (Russian and English) for maximum convenience of a global audience.
- **Адаптивный дизайн | Responsive Design:** Оптимизированный пользовательский интерфейс, который прекрасно выглядит и функционирует на любых устройствах: от мобильных телефонов до десктопов, благодаря Tailwind CSS. | Optimized user interface that looks and functions beautifully on all devices, from mobile phones to desktops, thanks to Tailwind CSS.

## Технологии || Technologies

- **Frontend:**
  - [React](https://react.dev/) - Библиотека для создания пользовательских интерфейсов. | A library for building user interfaces.
  - [Vite](https://vitejs.dev/) - Инструмент для быстрой сборки и разработки. | A fast build tool and development server.
  - [React Router DOM](https://reactrouter.com/web/guides/quick-start) - Для маршрутизации в приложении. | For routing within the application.
  - [Tailwind CSS](https://tailwindcss.com/) - CSS-фреймворк для быстрого стилизования. | A CSS framework for rapid styling.
  - [i18next & react-i18next](https://react.i18next.com/) - Для международной локализации. | For internationalization.
  - [react-qr-code](https://www.npmjs.com/package/react-qr-c0 ode) - Для генерации QR-кодов. | For generating QR codes.
- **Backend:**
  - [Node.js](https://nodejs.org/) - Среда выполнения JavaScript для создания масштабируемых сетевых приложений. | A JavaScript runtime for building scalable network applications.
  - [Express.js](https://expressjs.com/) - Минималистичный и гибкий фреймворк для веб-приложений Node.js. | A minimalist and flexible Node.js web application framework.
  - [MongoDB + Mongoose](https://www.mongodb.com/) - Популярная документо-ориентированная база данных NoSQL. | A popular document-oriented NoSQL database.
- **Testing and Development:**
  - [Mock Service Worker (MSW)](https://mswjs.io/) - Для мокирования API в браузере. | For mocking API in the browser.

## Перспективы Развития и Будущие Обновления || Development Prospects and Future Updates

стремимся превратить ShortURL в комплексное решение для бизнеса и индивидуальных пользователей, предлагая расширенные функции управления трафиком и аналитики. В планах по развитию:

aim to transform ShortURL into a comprehensive solution for businesses and individual users, offering advanced traffic management and analytics features. Development plans include:

- **Расширенный Трекинг и Аналитика | Advanced Tracking and Analytics:** Внедрение детальной статистики по кликам, географии, источникам трафика и другим показателям для глубокого анализа эффективности ссылок. | Implementing detailed statistics on clicks, geography, traffic sources, and other metrics for in-depth link performance analysis.
- **Kill Switch (Остановка ссылки) | Kill Switch (Link Deactivation):** Возможность мгновенно деактивировать любую сокращенную ссылку для контроля над распространением информации. | The ability to instantly deactivate any shortened link to control information dissemination.
- **Настраиваемые QR-коды | Customizable QR Codes:** Расширенные опции для кастомизации дизайна QR-кодов (цвета, логотипы) для соответствия брендингу. | Advanced options for customizing QR code design (colors, logos) to match branding.
- **Управление Кастомными Доменами | Custom Domain Management:** Поддержка привязки собственных доменов для сокращения ссылок, повышая узнаваемость бренда и доверие пользователей. | Support for binding custom domains for link shortening, enhancing brand recognition and user trust.
- **Динамический Редирект без Смены QR | Dynamic Redirect without QR Change:** Возможность изменять целевой URL сокращенной ссылки или QR-кода без необходимости перегенерации самого QR-кода. | The ability to change the target URL of a shortened link or QR code without needing to regenerate the QR code itself.

## Структура проекта || Project Structure

```
ShrotlyUrl
├─ README.md
├─ eslint.config.js
├─ index.html
├─ index.js
├─ package-lock.json
├─ package.json
├─ public
│  └─ mockServiceWorker.js
├─ routes
│  └─ cut.js
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
│  │  └─ user.js
│  └─ utils
│     └─ shortcodegen.js
├─ src
│  ├─ api
│  │  └─ axios.js
│  ├─ assets
│  │  ├─ burger-cross.svg
│  │  ├─ burger.svg
│  │  ├─ cross.svg
│  │  └─ home-page.png
│  ├─ context
│  │  └─ AuthProvider.jsx
│  ├─ elements
│  │  ├─ Aboutpage.jsx
│  │  ├─ App.jsx
│  │  ├─ Homepage
│  │  │  ├─ copy_button.jsx
│  │  │  ├─ loadQR_Button.jsx
│  │  │  ├─ main_form.jsx
│  │  │  ├─ qr_gen.jsx
│  │  │  └─ submit_button.jsx
│  │  ├─ Myurls
│  │  │  ├─ logout.jsx
│  │  │  └─ myurlslist.jsx
│  │  ├─ Pages
│  │  │  ├─ !Homepage.jsx
│  │  │  ├─ !Myurlspage.jsx
│  │  │  ├─ !Registrpage.jsx
│  │  │  ├─ !Signinpage.jsx
│  │  │  └─ PrivateRoute.jsx
│  │  ├─ Registration
│  │  │  ├─ registr_form.jsx
│  │  │  └─ signin_form.jsx
│  │  ├─ layout
│  │  │  ├─ footer.jsx
│  │  │  └─ header_bar.jsx
│  │  └─ shared
│  │     ├─ AppLoader.jsx
│  │     ├─ h1.jsx
│  │     ├─ lang_checkbox.jsx
│  │     ├─ messagewindow.jsx
│  │     ├─ registr_submit.jsx
│  │     └─ wrapper_home.jsx
│  ├─ fonts
│  │  └─ amazdoomleft.ttf
│  ├─ main.jsx
│  ├─ mocks
│  │  ├─ browser.js
│  │  └─ handlers.js
│  ├─ planning.excalidraw
│  ├─ style.css
│  ├─ translation
│  │  ├─ i18n.js
│  │  └─ languages
│  │     ├─ en_lang.json
│  │     └─ ru_lang.json
│  └─ utils
│     ├─ containsMyDomain.js
│     ├─ formatDate.js
│     ├─ loginvalidate.js
│     ├─ useAuth.js
│     ├─ useAuthOnLoading.js
│     ├─ useAxiosPrivate.js
│     └─ useRefreshToken.js
├─ tailwind.config.js
└─ vite.config.js
```
