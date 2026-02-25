# ShortlyURL — Self-Hosted Edition

Корпоративный сервис сокращения ссылок. Разворачивается на собственном сервере под брендовым доменом — `go.brand.com`, `links.company.ru` и т.д. Полный HTTPS, никаких внешних зависимостей.

## Функционал

| Функция           | Описание                                                             |
| ----------------- | -------------------------------------------------------------------- |
| Сокращение ссылок | Генерация коротких кодов (7 символов)                                |
| Кастомные алиасы  | Собственное имя ссылки (`/my-campaign`)                              |
| UTM-параметры     | Встроенный конструктор меток прямо в форме                           |
| QR-коды           | Автоматическая генерация при сокращении                              |
| Аналитика         | Клики по устройствам, браузерам, странам, источникам                 |
| Share-страница    | Публичная страница ссылки со статистикой                             |
| Время жизни       | Настройка срока действия (час / день / неделя / месяц / произвольно) |
| Тёмная тема       | Переключение светлая ↔ тёмная                                        |
| Локализация       | Русский и английский язык                                            |
| Аккаунты          | Регистрация, авторизация, JWT                                        |
| Панель управления | Список ссылок с фильтром, редактированием и удалением                |

---

## Требования

- Сервер с публичным IP или hostname в корпоративной сети
- Домен (например `go.brand.com`), указывающий на IP сервера
- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2+
- SSL-сертификат для домена

> Node.js и MongoDB устанавливать **не нужно** — всё работает внутри контейнеров.

---

## Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone https://github.com/LUKON1/ShrotlyUrl.git
cd ShrotlyUrl
```

### 2. Получить SSL-сертификат

#### Вариант A: Let's Encrypt (рекомендуется для публичных доменов)

```bash
# Установить certbot
sudo apt install certbot

# Получить сертификат (порт 80 должен быть свободен)
sudo certbot certonly --standalone -d go.brand.com

# Сертификаты будут в:
# /etc/letsencrypt/live/go.brand.com/fullchain.pem
# /etc/letsencrypt/live/go.brand.com/privkey.pem
```

Создать папку `ssl/` и скопировать туда сертификаты:

```bash
mkdir ssl
sudo cp /etc/letsencrypt/live/go.brand.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/go.brand.com/privkey.pem  ssl/
sudo chown $USER:$USER ssl/*.pem
```

#### Вариант B: Корпоративный/самоподписанный сертификат

Поместите файлы сертификата в папку `ssl/`:

```
ssl/
  fullchain.pem   — сертификат + цепочка CA
  privkey.pem     — приватный ключ
```

### 3. Создать файл конфигурации

```bash
cp .env.example .env
```

Откройте `.env` и заполните значения:

```env
# Ваш домен (используется в генерируемых ссылках)
VITE_BASE_URL=https://go.brand.com
HOST_NAME=https://go.brand.com

# JWT-секреты — замените на случайные строки 32+ символа
JWT_SECRET=<случайная_строка>
JWT_REFRESH_SECRET=<другая_случайная_строка>
```

> `VITE_API_BASE_URL` оставьте `/api` — Nginx проксирует запросы внутри контейнера.

### 4. Собрать фронтенд

Перед сборкой Docker-образа нужно собрать React-приложение локально (переменные Vite встраиваются на этапе сборки):

```bash
npm install
npm run build
```

### 5. Запустить

```bash
docker compose up -d --build
```

Сервис будет доступен по адресу: **https://go.brand.com**

---

## Структура файлов

```
ShrotlyUrl/
├── ssl/
│   ├── fullchain.pem   ← сертификат (не коммитить в git!)
│   └── privkey.pem     ← приватный ключ (не коммитить в git!)
├── dist/               ← собранный фронтенд (npm run build)
├── nginx.conf          ← конфигурация Nginx
├── docker-compose.yml
└── .env                ← ваши настройки
```

> Папка `ssl/` и `dist/` добавлены в `.gitignore` — секреты не попадут в репозиторий.

---

## Структура контейнеров

```
shortly_mongo     — MongoDB 7 (данные в volume mongo_data)
shortly_backend   — Node.js / Express API (внутренний порт 3000)
shortly_frontend  — Nginx: статика + SSL-терминация (порты 80, 443)
```

HTTP (порт 80) автоматически перенаправляется на HTTPS (порт 443).

---

## Управление

### Остановить

```bash
docker compose down
```

Данные MongoDB сохраняются в Docker volume `mongo_data`.

### Сбросить базу данных

```bash
docker compose down -v
```

### Обновить приложение

```bash
git pull
npm run build
docker compose up -d --build
```

### Обновить SSL-сертификат (Let's Encrypt)

```bash
sudo certbot renew
sudo cp /etc/letsencrypt/live/go.brand.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/go.brand.com/privkey.pem  ssl/
docker compose restart frontend
```

---

## .gitignore

Убедитесь, что в `.gitignore` есть:

```
ssl/
dist/
.env
```

---

## Лицензия

MIT — свободное использование, модификация и распространение.  
© 2025 [LUKON](https://github.com/LUKON1)
