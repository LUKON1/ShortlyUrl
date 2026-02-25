# ShortlyURL — Self-Hosted Edition

Современный сервис сокращения ссылок с аналитикой, UTM-параметрами и QR-кодами. Запускается локально с помощью Docker — никаких облачных зависимостей.

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

## Требования

- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2+

> Node.js и MongoDB устанавливать **не нужно** — всё работает внутри контейнеров.

## Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone https://github.com/LUKON1/ShrotlyUrl.git
cd ShrotlyUrl
```

### 2. Создать файл конфигурации

```bash
cp .env.example .env
```

Откройте `.env` и заполните обязательные значения:

```env
VITE_BASE_URL=http://localhost          # адрес, на котором будет доступен сервис
HOST_NAME=http://localhost              # тот же адрес для бекенда
JWT_SECRET=<случайная_строка_32+_символа>
REFRESH_TOKEN_SECRET=<другая_случайная_строка>
```

> Остальные значения можно оставить по умолчанию для локального запуска.

### 3. Запустить

```bash
docker compose up -d --build
```

Сервис будет доступен по адресу: **http://localhost**

### 4. Остановить

```bash
docker compose down
```

Данные MongoDB сохраняются в Docker volume `mongo_data` и не удаляются при остановке.

## Структура контейнеров

```
shortly_mongo     — MongoDB 7 (данные в volume mongo_data)
shortly_backend   — Node.js / Express API (порт 3000)
shortly_frontend  — Nginx со сборкой React (порт 80)
```

## Сброс данных

Чтобы полностью очистить базу данных:

```bash
docker compose down -v
```

> Флаг `-v` удаляет volume с данными MongoDB.

## Обновление

```bash
git pull
docker compose up -d --build
```

## Кастомный домен организации

По умолчанию сервис доступен на `http://localhost`. Чтобы использовать внутренний домен (`links.company.local`) или внешний (`go.company.com`):

### 1. Задать домен в `.env`

```env
VITE_BASE_URL=http://links.company.local
HOST_NAME=http://links.company.local
VITE_API_BASE_URL=http://links.company.local/api
```

### 2a. Локальная сеть (без внешнего IP)

Добавить DNS-запись на корпоративный DNS-сервер:

```
links.company.local  A  192.168.1.10   # IP сервера с Docker
```

Или на каждом компьютере в `/etc/hosts` (Linux/Mac) / `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
192.168.1.10  links.company.local
```

### 2b. Внешний домен с HTTPS

Разместить перед контейнером reverse proxy (Nginx/Caddy) и настроить SSL:

```nginx
server {
    listen 443 ssl;
    server_name go.company.com;
    # ssl_certificate / ssl_certificate_key ...

    location / {
        proxy_pass http://localhost:80;
    }
}
```

Обновить `.env`:

```env
VITE_BASE_URL=https://go.company.com
HOST_NAME=https://go.company.com
VITE_API_BASE_URL=https://go.company.com/api
```

## Лицензия

MIT — свободное использование, модификация и распространение.  
© 2025 [LUKON](https://github.com/LUKON1)
