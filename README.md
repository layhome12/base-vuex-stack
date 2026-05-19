# Vue + Express Starter

Fullstack application using:

- Typescript
- Vue 3
- Express.js
- Knex.js
- Pinia
- TailwindCSS

## Install

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

## Build

Frontend:

```bash
npm run build
```

Backend:

```bash
npm run build
npm start
```

## Notes

If you encounter CORS issues during development, use your local IP instead of `localhost` and adjust the allowed `origin` in the backend CORS configuration.

Example:

Frontend:

```txt
http://192.168.1.10:5173
```

Backend CORS:

```ts
origin: ["http://192.168.1.10:5173"]
```

---

Made with ❤️ by **MadHome Team**