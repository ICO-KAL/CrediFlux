# CrediFlux

CrediFlux es un sistema de gestión de préstamos diseñado para controlar solicitudes, clientes, montos, plazos y seguimiento de pagos de manera ordenada y segura. La idea principal es ofrecer una solución moderna y escalable para administrar operaciones de crédito dentro de una entidad financiera o negocio que maneje préstamos.

Este proyecto se encuentra en desarrollo inicial y combina un frontend con React y un backend en Express con MongoDB para sentar la base de un sistema funcional de administración de préstamos.

## ✨ Características principales

- Gestión de usuarios y autenticación
- Registro, revisión y decisión de solicitudes de préstamo
- Control de clientes y montos solicitados
- Configuración de productos, plazos y condiciones de crédito
- Originación de préstamos y generación de tablas de amortización
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

Las utilidades compartidas del frontend se encuentran en `src/frontend/helpers`: formato de interfaz en `uiHelpr.js`, validación en `validation.js` y creación de opciones en `options.js`. Los componentes visuales compartidos permanecen en `src/frontend/components`.

El transporte HTTP compartido del frontend está en `src/frontend/services/http.js`; los clientes de autenticación y del panel conservan su propio manejo de errores y renovación. Las secciones con pestañas reutilizan `TabbedResourceSection.jsx` y las columnas comunes de préstamos y solicitudes están en `resourceColumns.jsx`.

El registro utiliza nombre de usuario, correo y contraseña. El frontend envía la contraseña al endpoint de autenticación por HTTPS en producción; el backend la cifra con bcrypt antes de guardarla. El inicio de sesión devuelve tokens de sesión, que el navegador mantiene en memoria y en `sessionStorage`; si se marca «Mantener mi sesión iniciada», se guardan en `localStorage`. El backend renueva las sesiones al restaurarlas.

Las cuentas nuevas se crean sin roles: no reciben automáticamente el rol de administrador ni tampoco uno de cliente. Un administrador autorizado puede asignarles roles desde **Administración > Usuarios**; las acciones protegidas por permisos requieren el rol correspondiente.

El registro se envía mediante `POST /auth/register`, no abriendo la dirección directamente en el navegador (que usa GET). Si el usuario o el correo ya existe, la API responde `409` y el formulario muestra el aviso correspondiente.

El token de acceso dura una hora y se intenta renovar cinco minutos antes de su vencimiento. La sesión de renovación dura 30 días y se extiende al renovarse; cada renovación rota el token. Las solicitudes simultáneas comparten la renovación y, cuando el navegador admite Web Locks, también se coordinan entre pestañas. Ante fallos de conexión se realizan hasta dos reintentos; el servidor admite repetir la misma operación durante dos minutos para recuperar una respuesta perdida sin volver a rotar el token. Los errores temporales no cierran la sesión; una sesión inválida o cuenta inactiva requiere autenticación nuevamente. **Cerrar sesión** revoca todas las sesiones de la cuenta en todos los dispositivos, incluida la sesión actual.

En los modelos del backend, las búsquedas individuales usan `getEntidad(filtro)`, incluido el caso de búsqueda por ID mediante `{ _id: id }`. El modelo de usuario permite solicitar explícitamente la contraseña cifrada o los permisos mediante las opciones `incluirPassword` e `incluirPermisos`; la contraseña permanece oculta por defecto. El modelo de roles permite solicitar sus permisos con `incluirPermisos`.

## Solicitud, evaluación y originación

### Solicitudes y decisiones de crédito

- En **Solicitudes**, registra cliente, producto, monto, plazo en meses y destino del dinero. La API valida que el cliente esté activo y que el monto y el plazo respeten los límites del producto.
- Una solicitud pendiente puede enviarse a revisión. En **Evaluación**, registra el score de buró y la relación deuda/ingreso antes de decidir.
- Las decisiones admiten aprobación (con monto aprobado), rechazo (con razón) o estado **condicionada** (con condiciones obligatorias). Una solicitud condicionada no se puede originar como préstamo; después de atender las condiciones, un analista puede aprobarla o rechazarla desde la misma pantalla. Cada decisión queda registrada en el historial.
- En las rutas de revisión y evaluación se exige el permiso `solicitudes_credito/revisar`; para decidir se exige `solicitudes_credito/decidir`. El permiso `solicitudes_credito/decidir_monto_alto` queda reservado a la aprobación final de montos altos.
- El bootstrap crea `montoMaximoAprobacionAnalista` con valor inicial cero. En **Auditoría y config. > Configuración**, edítalo como monto en DOP. Si el parámetro no existe, el umbral es cero y toda aprobación requiere permiso de administrador. Se compara el umbral con el mayor entre el monto solicitado y el monto aprobado. Una justificación en **Excepción** también requiere aprobación final de administrador y queda registrada en el historial.
- La solicitud aprobada se convierte en préstamo desde **Préstamos**. El principal aprobado no puede superar el monto solicitado.

### Productos y cálculos financieros

Los parámetros se configuran en el producto de crédito ya existente:

- **Tasa**: fija o variable, expresada como tasa anual. Según la política definida, se toma la tasa vigente al originar el préstamo; marcarla como variable no actualiza automáticamente un préstamo ni recalcula cuotas ya generadas.
- **Amortización**: sistema francés, de cuota periódica fija, o alemán, de capital periódico fijo e interés decreciente.
- **Frecuencia**: mensual, quincenal o semanal. El plazo capturado sigue expresándose en meses; el número de cuotas se obtiene usando 12, 26 o 52 períodos por año, respectivamente, y se redondea al entero más cercano. Las tasas periódicas se derivan de la tasa anual dividida entre esos períodos.
- **Mora**: cargo fijo por cuota (compatibilidad con productos existentes) o porcentaje del total de la cuota vencida, con tope monetario por cuota y días de gracia configurables. Se cobra una sola vez al registrar el pago después de la fecha de vencimiento y los días de gracia; no se capitaliza. La vista de cuotas y el formulario de pago muestran el cargo, y la API vuelve a calcularlo al registrar el pago.

La tasa, sistema, frecuencia y mora del producto se copian al préstamo al originarlo; editar el producto afecta nuevas originaciones, no cambia contratos existentes. Al registrar un **Desembolso**, el sistema crea las cuotas y el plan de amortización del préstamo con capital, interés, total y fechas de vencimiento. El plan guarda el sistema y la frecuencia utilizados. En pagos, cada cuota se liquida completa; el monto incluye la mora aplicable, si la hubiera.

## Administración, RBAC y monitoreo

- En **Administración > Usuarios**, se pueden asignar varios roles o dejar la lista vacía para revocar los permisos derivados de sus roles; también se pueden desactivar/reactivar cuentas. La API bloquea sesiones de cuentas inactivas y evita retirar o desactivar al último administrador activo. En **Roles**, se pueden crear roles y asignar permisos por módulo y acción. Los endpoints de usuarios, roles, permisos y configuración requieren permisos administrativos; el administrador inicial recibe estos permisos con `npm run bootstrap:admin`.
- Las aprobaciones por encima del umbral configurable o con una excepción requieren además `solicitudes_credito/decidir_monto_alto`. Esto se valida en la API, no solo en la interfaz.
- El panel muestra capital pendiente de cobro, PAR 30, exposición PAR 30, préstamos con cuotas vencidas por 30 o más días y cobros del día UTC. PAR 30 se calcula como el capital pendiente de todos los préstamos con al menos una cuota impagada vencida hace 30 días o más, dividido entre el capital pendiente de la cartera activa y en mora.
- El contenido de cada sección se desplaza dentro del panel sin alargar el menú lateral. El menú se compacta en pantallas bajas y no muestra una barra de desplazamiento; si aun así no cabe, sus opciones siguen accesibles mediante rueda, pantalla táctil o teclado.

## 🧪 Scripts disponibles

En el archivo `package.json` se incluyen los siguientes scripts:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

Para comprobar las utilidades compartidas, ejecuta `node --test src/frontend/helpers/helpers.test.js`.
Para comprobar el transporte y la renovación del frontend, ejecuta `node --test src/frontend/frontend.test.js`.
Para comprobar las consultas de modelos y los controladores modificados, ejecuta `node --test src/backend/models/modelos.test.js src/backend/controller/usuario_controller.test.js src/backend/controller/sesiones_controller.test.js src/backend/controller/operaciones_modelo.test.js`.
Para comprobar los cálculos de amortización y mora, ejecuta `node --test src/backend/controller/desembolsos_controller.test.js`.
Para comprobar la política de mora fija y porcentual con tope, ejecuta `node --test src/backend/helpers/mora.test.js`.

## 🔐 Seguridad

El proyecto ya contempla el uso de:

- `bcrypt` para manejo de contraseñas
- `jsonwebtoken` para autenticación
- variables de entorno para no exponer credenciales sensibles

## 📌 Estado del proyecto

CrediFlux está en desarrollo. Incluye autenticación, gestión de clientes y solicitudes, evaluación y decisiones de crédito, productos, préstamos, desembolsos, planes de amortización, cuotas y pagos, además de módulos administrativos y financieros.

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
