# SocialN Frontend

Клиентская часть SPA-соцсети.

## что есть

- чаты в реальном времени (websocket)
- отправка и получение сообщений
- infinite scroll (сообщения / чаты / пользователи / музыка)
- список пользователей + создание чата
- профиль с аватаркой (загрузка / смена)
- музыка:
  - список треков
  - лайки
  - загрузка
  - закреплённый плеер (работает между вкладками)
- плеер живёт в zustand и не сбрасывается при навигации
- backend адрес настраивается через `.env`
---

## стек

react, vite, react-router-dom, zustand, websocket, react-virtuoso, @tanstack/react-virtual, sass

---

## запуск

```bash
git clone https://github.com/your-username/socialn-frontend.git
cd socialn-frontend
npm install
````

### env

создай `.env` в корне:

```bash
cp .env.example .env
```

запуск:

```bash
npm run dev
```
Backend должен быть запущен

---

## как устроено

* REST API — пользователи, музыка и т.д.
* WebSocket — сообщения
* Zustand — глобальный стейт (плеер, списки и т.д.)
* виртуализация — через react-virtuoso и tanstack virtual

---

## страницы

* /login /register
* /profile
* /messages
* /users
* /music

---

## backend

https://github.com/yunglaver/socialn-backend

---

## детали


