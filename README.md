# CrediFlux

CrediFlux es un sistema de gestión de préstamos diseñado para controlar solicitudes, clientes, montos, plazos y seguimiento de pagos de manera ordenada y segura. La idea principal es ofrecer una solución moderna y escalable para administrar operaciones de crédito dentro de una entidad financiera o negocio que maneje préstamos.

Este proyecto se encuentra en desarrollo inicial y combina un frontend con React y un backend en Express con MongoDB para sentar la base de un sistema funcional de administración de préstamos.

## ✨ Características principales

- Gestión de usuarios y autenticación
- Registro y seguimiento de solicitudes de préstamo
- Control de clientes y montos solicitados
- Administración de plazos y condiciones de crédito
- Conexión a MongoDB Atlas con Mongoose
- API REST con Express
- Interfaz con React + Vite
- Variables de entorno para credenciales y configuración

## 🛠️ Tecnologías utilizadas

- React
- Vite
- JavaScript
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- dotenv

## 📁 Estructura del proyecto

```bash
prestamoGestions/
├── src/
│   ├── backend/
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── credifluxDB.js
│   │   ├── routes/
│   │   │   └── login.js
│   │   └── schemes/
│   │       └── user.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 🚀 Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

- Node.js 18 o superior
- npm o yarn
- MongoDB Atlas o una instancia local de MongoDB

## ⚙️ Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd prestamoGestions
```

2. Instala las dependencias:

```bash
npm install
```

3. Copia `.env.example` a `.env` y completa tus credenciales locales. No compartas ni subas `.env`.

```env
name=tu_usuario_mongo
passwoard=tu_password_mongo
JSON_WEB_TOKEN=define_un_secreto_largo_y_aleatorio
PORT=3000
FRONTEND_URL=http://localhost:5173,http://127.0.0.1:5173
VITE_API_URL=/auth
```

4. Inicia el frontend y la API en desarrollo:

```bash
npm run dev:full
```

También puedes iniciar cada servicio en una terminal separada:

```bash
npm run dev:api
npm run dev
```

Vite reenvía `/auth` al backend en `http://127.0.0.1:3000`. Para desplegar el frontend y la API en dominios distintos, configura `VITE_API_URL` con la URL base de autenticación y `FRONTEND_URL` con el origen del frontend permitido por CORS.

El registro utiliza nombre de usuario, correo y contraseña. El frontend envía la contraseña al endpoint de autenticación por HTTPS en producción; el backend la cifra con bcrypt antes de guardarla. El inicio de sesión devuelve tokens de sesión, que el navegador mantiene en memoria y en `sessionStorage`; si se marca «Mantener mi sesión iniciada», se guardan en `localStorage`. El backend renueva las sesiones al restaurarlas.

## 🧪 Scripts disponibles

En el archivo `package.json` se incluyen los siguientes scripts:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## 🔐 Seguridad

El proyecto ya contempla el uso de:

- `bcrypt` para manejo de contraseñas
- `jsonwebtoken` para autenticación
- variables de entorno para no exponer credenciales sensibles

## 📌 Estado del proyecto

CrediFlux está en fase inicial de desarrollo. Actualmente se encuentra estructurado con la base del frontend y el backend, además de la conexión a MongoDB. Las funcionalidades principales de autenticación y gestión de préstamos se están desarrollando progresivamente.

## 🧭 Objetivo del proyecto

Brindar una herramienta útil para la administración de préstamos con una experiencia clara para usuarios y administradores, optimizando procesos que normalmente se manejan de forma manual.

## 🤝 Contribución

Las contribuciones son bienvenidas. Si deseas colaborar:

1. Haz un fork del proyecto
2. Crea una rama para tu funcionalidad
3. Realiza tus cambios
4. Envía un pull request

## 📄 Licencia

Este proyecto está bajo una licencia de uso personal o educativa. Si deseas usarlo en producción, es recomendable definir una licencia formal según el tipo de implementación.

## 👤 Autor

Proyecto desarrollado por el autor del repositorio actual.
