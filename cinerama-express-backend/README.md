# 🎬 CINERAMA

**CINERAMA** es un sistema web para la gestión y compra de entradas de cine, desarrollado con un **frontend en HTML, CSS y JavaScript** y un **backend REST en Node.js + Express**.

El sistema permite realizar el flujo completo de una reserva: seleccionar cine, película, horario, asientos, productos, registrar los datos del cliente, realizar el proceso de pago y generar un voucher de compra.

La información de las reservas se almacena en una base de datos **MySQL alojada en Aiven**, mientras que el backend se encuentra desplegado en **Render**. Además, el sistema utiliza **Google reCAPTCHA v2** para proteger el acceso administrativo y **Brevo** para enviar automáticamente el voucher de compra al correo electrónico del cliente.

---

## 📌 Estado actual del proyecto

Actualmente el sistema cuenta con:

- ✅ Frontend desarrollado con **HTML, CSS y JavaScript**.
- ✅ Backend desarrollado con **Node.js + Express**.
- ✅ Base de datos **MySQL alojada en Aiven**.
- ✅ Conexión segura del backend hacia Aiven mediante **SSL**.
- ✅ Backend desplegado como **Web Service en Render**.
- ✅ Frontend desplegado en **Render**.
- ✅ Configuración para trabajar tanto en **localhost como en producción**.
- ✅ Registro y actualización de reservas en MySQL.
- ✅ Selección y almacenamiento de asientos.
- ✅ Registro de productos asociados a una reserva.
- ✅ Registro de datos del cliente y método de pago.
- ✅ Generación del voucher de compra.
- ✅ Envío automático del voucher mediante **Brevo Transactional Email API**.
- ✅ Login administrativo protegido mediante **Google reCAPTCHA v2**.
- ✅ Panel administrativo protegido.
- ✅ Variables sensibles administradas mediante archivos `.env` y variables de entorno de Render.

---

# 🚀 Arranque del proyecto en local

## 1. Abrir el backend

Desde una terminal de VS Code ingresar a:

```bash
cd "C:\SEXTO CICLO\PROYECTO DE APLICACION EMPRESARIAL\CINERAMA\cinerama-frontend-main\cinerama-frontend-main\cinerama-express-backend"

Luego ejecutar:

npm run dev

También se puede utilizar:

npm start

El backend utiliza el puerto 3001 cuando se ejecuta localmente:

http://localhost:3001

Si la conexión es correcta, en la terminal debe aparecer aproximadamente:

Backend escuchando en puerto 3001
Acceso local: http://localhost:3001
✅ MySQL Aiven conectado correctamente

En producción, Render asigna automáticamente el puerto mediante la variable de entorno PORT.

🎯 Funcionalidades principales
🏠 Página principal

index.html

Contiene la página principal del cine con:

Slider principal.
Navegación.
Menú hamburguesa.
Información de películas.
Selección de cine.
Acceso a cartelera, estrenos, comida y demás secciones.
🎬 Cartelera y estrenos

Archivos principales:

cartelera.html
estrenos.html

js/cartelera.js
js/estrenos.js
js/info.js
js/infoestrenos.js

Permiten:

Mostrar películas disponibles.
Consultar información de cada película.
Mostrar director, duración, reparto y sinopsis.
Reproducir trailers.
Seleccionar horarios.
Registrar película, sala, horario y tipo de cine en la reserva.
🪑 Selección de asientos

Archivos:

asientos.html
js/asientos.js

Permite:

Mostrar las butacas disponibles.
Seleccionar uno o varios asientos.
Controlar la cantidad de entradas.
Calcular el monto correspondiente.
Asociar los asientos seleccionados con la reserva actual.

Durante el flujo se utiliza temporalmente:

localStorage.getItem("reservaId")

para identificar qué reserva se está modificando.

localStorage se utiliza para mantener información temporal entre páginas, pero la reserva final se almacena en MySQL.

🍿 Selección de productos

Archivos:

comida.html
js/comida.js

Permite seleccionar productos adicionales como alimentos y bebidas.

Los productos quedan asociados a la reserva mediante el backend y posteriormente aparecen en el voucher.

Cada producto puede contener:

Producto
Cantidad
Subtotal
💳 Proceso de pago

Archivos:

pago.html
js/pago.js

Permite registrar información relacionada con la compra, incluyendo:

Datos del cliente.
Correo electrónico.
Método de pago.
Billetera digital, cuando corresponda.
Cantidad de entradas.
Monto de entradas.
Estado de la reserva.

La información es enviada al backend y almacenada en la base de datos MySQL.

El sistema académico registra el proceso de pago y la reserva. No constituye una integración bancaria real con un procesador de tarjetas.

🧾 Voucher de compra

Archivos:

voucher.html
js/voucher.js

Después de completar la compra, el sistema consulta la reserva almacenada en MySQL y muestra:

Estado de la compra.
Cine.
Película.
Tipo de sala.
Horario.
Asientos.
Cantidad de entradas.
Productos comprados.
Total de productos.
Total de entradas.
Total pagado.
Nombre del cliente.
Correo.
Método de pago.

También se ejecuta automáticamente:

POST /api/reservas/:id/enviar-voucher

para solicitar al backend el envío del comprobante por correo electrónico.

📧 Envío del voucher por correo

El backend utiliza Brevo Transactional Email API.

Flujo:

Compra finalizada
      ↓
voucher.js
      ↓
POST /api/reservas/:id/enviar-voucher
      ↓
Backend Express
      ↓
Consulta reserva en MySQL
      ↓
Consulta productos
      ↓
Genera voucher HTML
      ↓
Brevo API
      ↓
Correo del cliente

La credencial se almacena mediante:

BREVO_API_KEY=TU_API_KEY

La API Key nunca debe escribirse directamente en el código ni subirse a GitHub.

📩 Contacto

Archivos:

contacto.html
js/contacto.js

Permite gestionar el formulario de contacto del sistema.

El backend dispone de la ruta:

/api/contacto

para las operaciones correspondientes al módulo.

🔐 Login administrativo

Archivos:

login.html
js/login.js

El login administrativo utiliza:

Usuario.
Contraseña.
Google reCAPTCHA v2.
Backend Express.

La petición se realiza mediante:

POST /api/auth/login

Cuando las credenciales son correctas y el CAPTCHA es válido:

localStorage.setItem("adminLogeado", "true");

También se almacena temporalmente la información del usuario:

localStorage.setItem(
    "usuarioSesion",
    JSON.stringify(data.usuario)
);
🛡️ Protección del panel administrativo

Las páginas administrativas utilizan:

<body data-require-admin="true">

Si el usuario intenta ingresar sin haber iniciado sesión, es redirigido y se muestra un mensaje de acceso restringido.

El cierre de sesión elimina:

localStorage.removeItem("adminLogeado");
localStorage.removeItem("usuarioSesion");
🧱 Estructura principal del proyecto
CINERAMA/
│
├── cinerama-express-backend/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── verifyCaptcha.js
│   │   │
│   │   ├── routes/
│   │   │   ├── admin.js
│   │   │   ├── auth.js
│   │   │   ├── contacto.js
│   │   │   ├── reservas.js
│   │   │   └── usuarios.js
│   │   │
│   │   ├── db.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── ca.pem
│   ├── package.json
│   └── package-lock.json
│
├── css/
│
├── js/
│   ├── asientos.js
│   ├── auth.js
│   ├── cartelera.js
│   ├── comida.js
│   ├── config.js
│   ├── contacto.js
│   ├── estrenos.js
│   ├── info.js
│   ├── infoestrenos.js
│   ├── login.js
│   ├── pago.js
│   ├── reservaciones.js
│   ├── script.js
│   └── voucher.js
│
├── imagenes/
├── audio/
├── videos/
│
├── index.html
├── cartelera.html
├── comida.html
├── contacto.html
├── estrenos.html
├── info.html
├── infoestrenos.html
├── login.html
├── pago.html
├── reservaciones.html
├── voucher.html
├── asientos.html
│
└── cinerama1.sql
⚙️ Tecnologías y servicios utilizados
Frontend
HTML5
CSS3
JavaScript
LocalStorage para mantener información temporal entre pantallas
Backend
Node.js
Express
mysql2
dotenv
cors
helmet
express-rate-limit
Base de datos
MySQL
Aiven Cloud
DBeaver para administración y pruebas de conexión
Seguridad
Google reCAPTCHA v2
Helmet
Express Rate Limit
Variables de entorno
SSL para la conexión MySQL
Hosting y servicios externos
Render — despliegue del frontend y backend
Aiven — alojamiento MySQL
Brevo — envío de correos transaccionales
Google reCAPTCHA — protección del login
GitHub — repositorio y despliegue del código
🗃️ Base de datos MySQL con Aiven

La base de datos MySQL se encuentra alojada en Aiven Cloud.

La creación inicial se realizó utilizando un servicio MySQL y obteniendo desde Aiven:

Database
Host
Port
User
Password
Service URI

Aiven exige conexión mediante SSL:

ssl-mode=REQUIRED

La conexión fue comprobada previamente mediante DBeaver.

La guía detallada utilizada para configurar Aiven y DBeaver se encuentra documentada por separado.

🔌 Configuración utilizada en DBeaver

Se creó una conexión:

Nueva conexión
→ MySQL

utilizando los datos proporcionados por Aiven.

Debido a los requisitos de conexión se configuraron:

allowPublicKeyRetrieval = true
sslMode = REQUIRED

La configuración final quedó conceptualmente como:

SSL = activado
Require SSL = activado
Verify server certificate = desactivado
Allow public key retrieval = activado

La conexión terminó siendo validada correctamente contra MySQL de Aiven.

🔐 Variables de entorno

El backend utiliza un archivo:

cinerama-express-backend/.env

Ejemplo:

PORT=3001

# MYSQL - AIVEN
DB_HOST=TU_HOST_AIVEN
DB_PORT=TU_PUERTO_AIVEN
DB_USER=avnadmin
DB_PASS=TU_PASSWORD
DB_NAME=defaultdb

# ADMIN
ADMIN_USER=admin@cinerama.com
ADMIN_PASS=TU_PASSWORD_ADMIN

# RECAPTCHA
RECAPTCHA_SECRET=TU_SECRET_KEY

# BREVO
BREVO_API_KEY=TU_API_KEY

Nunca subir el archivo .env al repositorio.

El .gitignore debe contener:

.env
node_modules/
🔑 Flujo de autenticación del administrador

El proceso es:

login.html
     ↓
Google reCAPTCHA v2
     ↓
js/login.js
     ↓
POST /api/auth/login
     ↓
verifyCaptcha.js
     ↓
Google verifica token
     ↓
authController.js
     ↓
Valida ADMIN_USER / ADMIN_PASS
     ↓
Acceso al panel

js/login.js envía:

{
    "usuario": "usuario",
    "password": "contraseña",
    "g-recaptcha-response": "TOKEN_RECAPTCHA"
}

Si las credenciales son correctas:

HTTP 200

y el frontend registra la sesión administrativa.

Si las credenciales son incorrectas:

HTTP 401
🌐 Configuración Local / Render

El proyecto puede utilizar el backend local durante desarrollo y el backend de Render en producción.

Para esto existe:

js/config.js

con una configuración similar a:

const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:3001"
        : "https://cinerama-backen-react-native.onrender.com";

Los archivos JavaScript deben utilizar:

fetch(`${API_URL}/api/...`)

Por ejemplo:

fetch(`${API_URL}/api/auth/login`)

De esta manera:

DESARROLLO
Frontend local
     ↓
http://localhost:3001


PRODUCCIÓN
Frontend Render
     ↓
https://cinerama-backen-react-native.onrender.com

Cuando un archivo JavaScript utiliza API_URL, config.js debe cargarse antes de dicho archivo.

Ejemplo:

<script src="js/config.js"></script>
<script src="js/login.js"></script>
☁️ Despliegue del backend en Render

El backend se encuentra desplegado como un Web Service.

Configuración:

Build Command:
npm install

Start Command:
npm start

El package.json debe disponer del script:

{
    "scripts": {
        "start": "node src/server.js"
    }
}

El servidor utiliza:

const PORT = process.env.PORT || 3001;

Esto permite:

Local  → puerto 3001
Render → puerto asignado por Render

Cuando el despliegue funciona correctamente aparecen mensajes similares a:

Backend escuchando en puerto 10000
✅ MySQL Aiven conectado correctamente
Your service is live
🔐 Variables de entorno en Render

Las variables locales del .env deben registrarse también en:

Render
→ Web Service
→ Environment

Por ejemplo:

DB_HOST
DB_PORT
DB_USER
DB_PASS
DB_NAME

ADMIN_USER
ADMIN_PASS

RECAPTCHA_SECRET

BREVO_API_KEY

Después:

Save, rebuild, and deploy
🤖 Configuración de Google reCAPTCHA

El proyecto utiliza Google reCAPTCHA v2 Checkbox.

En la configuración de la clave deben registrarse los dominios desde los cuales se utilizará el CAPTCHA.

Ejemplo:

localhost
cinerama-9dbf1.web.app
cinerama-web.onrender.com

Se debe registrar únicamente el dominio.

Correcto:

cinerama-web.onrender.com

Incorrecto:

https://cinerama-web.onrender.com/login.html

Si el dominio no está autorizado aparecerá:

ERROR para el propietario del sitio:
El dominio no es válido para la clave del sitio
📧 Configuración de Brevo

Brevo se utiliza para enviar el voucher de compra al correo electrónico ingresado por el cliente.

1. Crear cuenta

Crear una cuenta en Brevo y completar la configuración inicial.

2. Crear remitente

Ingresar a:

Settings
→ Remitentes, dominio, IP
→ Remitentes
→ Agregar remitente

Registrar un correo y verificarlo.

Debe aparecer:

Verificado
3. Crear API Key

Ingresar a:

Settings
→ SMTP y API
→ Claves API y MCP

Crear una nueva API Key.

Guardar la clave inmediatamente.

4. Configurar localmente

Agregar en .env:

BREVO_API_KEY=TU_API_KEY
5. Configurar Render

Ingresar a:

Render
→ Environment
→ Add variable

Agregar:

BREVO_API_KEY

Después ejecutar:

Save, rebuild, and deploy

Cuando el envío funciona correctamente el backend muestra:

✅ VOUCHER ENVIADO POR BREVO
🔄 Flujo general del sistema
                    USUARIO
                       │
                       ▼
               Selecciona cine
                       │
                       ▼
             Selecciona película
                       │
                       ▼
              Selecciona horario
                       │
                       ▼
              Selecciona asientos
                       │
                       ▼
              Selecciona productos
                       │
                       ▼
              Proceso de pago
                       │
                       ▼
               BACKEND EXPRESS
                       │
              ┌────────┴────────┐
              ▼                 ▼
         MYSQL AIVEN        BREVO API
              │                 │
              ▼                 ▼
      Guarda la reserva    Envía voucher
                                │
                                ▼
                         CORREO CLIENTE
🛠️ Guía rápida para volver a configurar todo

Si en el futuro se necesita reconstruir el proyecto desde cero:

Crear el frontend.
Crear el backend Express.
Crear MySQL en Aiven.
Obtener las credenciales de conexión.
Configurar SSL.
Probar la conexión mediante DBeaver.
Instalar mysql2.
Crear la conexión del backend con Aiven.
Crear las tablas.
Configurar .env.
Probar el backend en localhost:3001.
Probar el frontend localmente.
Crear config.js.
Subir el proyecto a GitHub.
Crear el Web Service en Render.
Registrar las variables de entorno.
Desplegar el backend.
Desplegar el frontend.
Registrar el dominio de Render en Google reCAPTCHA.
Crear y verificar un remitente en Brevo.
Crear la API Key de Brevo.
Registrar BREVO_API_KEY en Render.
Realizar una compra de prueba.
Comprobar la reserva en MySQL.
Comprobar que el voucher llegue al correo.

☁️ Arquitectura actual del proyecto

Actualmente CINERAMA funciona con la siguiente arquitectura:

┌──────────────────────────────┐
│          FRONTEND            │
│       HTML / CSS / JS        │
│                              │
│   cinerama-web.onrender.com  │
└──────────────┬───────────────┘
               │
               │ fetch()
               ▼
┌──────────────────────────────────────────┐
│                BACKEND                   │
│          Node.js + Express               │
│                                          │
│ cinerama-backen-react-native.onrender.com│
└──────────┬───────────────────┬───────────┘
           │                   │
           │                   │ API
           ▼                   ▼
┌────────────────────┐   ┌──────────────────┐
│       AIVEN        │   │      BREVO       │
│                    │   │                  │
│     MySQL 8        │   │ Envío de voucher│
│ Base de datos cloud│   │    por correo    │
└────────────────────┘   └──────────────────┘

Por lo tanto:

Frontend → Render
Backend  → Render
MySQL    → Aiven
Correo   → Brevo
Captcha  → Google reCAPTCHA v2
🗃️ Base de datos MySQL en Aiven

La base de datos del proyecto está alojada en Aiven utilizando MySQL.

Durante la creación del servicio se seleccionó:

Servicio: MySQL
Plan: Gratis

Aiven proporciona los siguientes datos:

Host
Port
Database
User
Password
Service URI
SSL

La conexión de Aiven requiere SSL:

ssl-mode=REQUIRED

La configuración fue comprobada previamente mediante DBeaver.

La guía completa de esta configuración se encuentra en:

GUIA DE AIVEN CONECTAR A HOSTING CON MYSQL EN LA CUBE.docx

La conexión quedó validada correctamente contra MySQL 8.4.8.

🔐 Variables de entorno del Backend

Las credenciales reales NO deben escribirse directamente en el código ni subirse a GitHub.

Para desarrollo local se utiliza:

cinerama-express-backend/.env

Ejemplo:

PORT=3001

# =========================
# MYSQL - AIVEN
# =========================

DB_HOST=HOST_DE_AIVEN
DB_PORT=PUERTO_DE_AIVEN
DB_USER=avnadmin
DB_PASS=CONTRASEÑA_DE_AIVEN
DB_NAME=defaultdb

# =========================
# ADMIN
# =========================

ADMIN_USER=admin@cinerama.com
ADMIN_PASS=TU_PASSWORD

# =========================
# GOOGLE RECAPTCHA
# =========================

RECAPTCHA_SECRET=TU_RECAPTCHA_SECRET

# =========================
# BREVO
# =========================

BREVO_API_KEY=TU_API_KEY_DE_BREVO

⚠️ Nunca subir .env a GitHub.

Debe existir en .gitignore:

.env
node_modules/
🔌 Conexión del backend con Aiven

El backend utiliza:

mysql2

Instalación:

npm install mysql2

La conexión se realiza mediante un pool de conexiones.

El archivo correspondiente es:

src/db.js

El backend utiliza las variables:

process.env.DB_HOST
process.env.DB_PORT
process.env.DB_USER
process.env.DB_PASS
process.env.DB_NAME

Al iniciar correctamente el backend debe aparecer:

Backend escuchando en puerto 3001
Acceso local: http://localhost:3001
✅ MySQL Aiven conectado correctamente

En Render el puerto es asignado automáticamente mediante:

const PORT = process.env.PORT || 3001;

Por eso NO se debe colocar solamente 3001 de forma fija.

🚀 Backend Express

El servidor principal se encuentra en:

cinerama-express-backend/src/server.js

Actualmente monta las rutas:

app.use("/api/reservas", reservasRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/contacto", contactoRouter);
app.use("/api/usuarios", usuariosRouter);

Por lo tanto el backend maneja:

/api/reservas
/api/admin
/api/auth
/api/contacto
/api/usuarios
🌐 Backend en Render

El backend fue desplegado como un Web Service de Render.

Repositorio:

GitHub
   ↓
Render Web Service
   ↓
Node.js / Express

Configuración utilizada:

Build Command:
npm install

Start Command:
npm start

El package.json debe contener:

{
  "scripts": {
    "start": "node src/server.js"
  }
}

La URL actual del backend es:

https://cinerama-backen-react-native.onrender.com

Cuando Render inicia correctamente debe aparecer:

Backend escuchando en puerto 10000
✅ MySQL Aiven conectado correctamente
Your service is live

El puerto 10000 puede ser asignado por Render y no representa un error.

🔐 Variables de entorno en Render

Las variables del .env local NO se suben a GitHub.

En Render deben configurarse manualmente desde:

Web Service
↓
Environment
↓
Environment Variables

Agregar las variables necesarias:

DB_HOST
DB_PORT
DB_USER
DB_PASS
DB_NAME

ADMIN_USER
ADMIN_PASS

RECAPTCHA_SECRET

BREVO_API_KEY

Después de modificar variables utilizar:

Save, rebuild, and deploy

Esto reinicia el backend con las nuevas variables.

🌍 Frontend local y Render con config.js

Para evitar escribir la URL del backend manualmente en todos los archivos JavaScript se creó:

js/config.js

Este archivo determina automáticamente si el frontend está ejecutándose localmente o en producción.

Ejemplo:

const API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001"
    : "https://cinerama-backen-react-native.onrender.com";

Después los demás archivos deben utilizar:

`${API_URL}/api/...`

Ejemplo:

fetch(`${API_URL}/api/reservas/${reservaId}`)

En lugar de escribir:

fetch("https://cinerama-backen-react-native.onrender.com/api/...")

Esto permite utilizar el mismo código tanto localmente como en Render.

💻 Desarrollo local

Para trabajar localmente primero se levanta el backend.

Desde VS Code:

cd cinerama-express-backend
npm run dev

o:

npm start

Debe aparecer:

Backend escuchando en puerto 3001
Acceso local: http://localhost:3001
✅ MySQL Aiven conectado correctamente

El frontend puede ejecutarse localmente y config.js utilizará automáticamente:

http://localhost:3001

Mientras que cuando el frontend esté desplegado utilizará:

https://cinerama-backen-react-native.onrender.com
🤖 Google reCAPTCHA v2

El login administrativo utiliza:

Google reCAPTCHA v2
"No soy un robot"

Para que funcione deben registrarse los dominios donde se ejecutará el frontend.

Actualmente se configuraron dominios como:

localhost
cinerama-9dbf1.web.app
cinerama-web.onrender.com

⚠️ Importante:

Google reCAPTCHA solicita dominios, no URLs completas.

Correcto:

cinerama-web.onrender.com

Incorrecto:

https://cinerama-web.onrender.com/login.html

Si el dominio no está registrado aparecerá:

ERROR para el propietario del sitio:
El dominio no es válido para la clave del sitio
🔑 Login administrativo

El login se encuentra en:

login.html
js/login.js

La petición debe utilizar API_URL:

const res = await fetch(`${API_URL}/api/auth/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    usuario: user,
    password: pass,
    "g-recaptcha-response": token,
  }),
});

Es importante cargar primero:

<script src="js/config.js"></script>
<script src="js/login.js"></script>

porque login.js necesita la variable:

API_URL
🎟️ Sistema de reservas

Las reservas ya no dependen únicamente de localStorage.

El frontend se comunica con:

/api/reservas

para registrar y actualizar la información de la reserva.

Durante el flujo de compra se almacenan datos como:

Cine
Película
Tipo de cine
Sala
Horario
Asientos
Cantidad de entradas
Monto de entradas
Productos
Cliente
Correo
Método de pago
Estado

El identificador de la reserva se mantiene temporalmente en:

localStorage.getItem("reservaId")

Esto permite continuar modificando la misma reserva mientras el usuario avanza entre las pantallas.

🍿 Productos de la reserva

Los productos seleccionados también están asociados a la reserva.

El voucher consulta:

GET /api/reservas/:id/productos

y obtiene información como:

nombre
cantidad
subtotal

El total final se calcula como:

TOTAL = monto de entradas + total de productos
🧾 Voucher

Después de completar la compra se muestra:

voucher.html

y:

js/voucher.js

consulta la reserva mediante:

fetch(`${API_URL}/api/reservas/${reservaId}`)

También obtiene los productos:

fetch(`${API_URL}/api/reservas/${reservaId}/productos`)

Finalmente solicita al backend enviar el comprobante:

POST /api/reservas/:id/enviar-voucher
📧 Envío de voucher mediante Brevo

Para enviar el voucher por correo se utiliza actualmente:

Brevo Transactional Email API

Se eligió utilizar la API de Brevo para que el envío funcione desde el backend desplegado.

El flujo es:

voucher.js
       ↓
POST /api/reservas/:id/enviar-voucher
       ↓
Express
       ↓
Busca reserva en Aiven
       ↓
Busca productos
       ↓
Brevo API
       ↓
Correo del cliente

La API Key se genera desde:

Brevo
→ Settings
→ SMTP y API
→ Claves API y MCP
→ Generar clave API

La clave se guarda en:

BREVO_API_KEY=xxxxxxxx

y en Render:

Environment
→ BREVO_API_KEY

⚠️ Nunca colocar la API Key directamente dentro de reservas.js.

📤 Remitente de Brevo

Antes de enviar correos se debe configurar un remitente.

Ruta:

Brevo
→ Settings
→ Remitentes, dominio, IP
→ Agregar remitente

El remitente debe aparecer:

Verificado

Ejemplo:

cinerama <correo-verificado@gmail.com>

Una vez verificado puede utilizarse para los correos transaccionales del proyecto.

📩 Envío de correo desde Express

El endpoint utilizado es:

POST /api/reservas/:id/enviar-voucher

El backend consulta primero:

SELECT * FROM reservas WHERE id = ?

y posteriormente consulta los productos relacionados con la reserva.

Finalmente realiza la petición a Brevo utilizando:

https://api.brevo.com/v3/smtp/email

con la API Key almacenada en:

process.env.BREVO_API_KEY

Cuando funciona correctamente el backend muestra:

✅ VOUCHER ENVIADO POR BREVO
⚠️ Error de Brevo: Key not found

Si aparece:

❌ ERROR BREVO:
{
  message: "Key not found",
  code: "unauthorized"
}

significa que la API Key utilizada no es válida, fue eliminada o el backend está utilizando otra variable.

Revisar:

BREVO_API_KEY

tanto en:

.env

como en:

Render → Environment

Después de modificarla en Render:

Save, rebuild, and deploy
🔄 Flujo completo actual de CINERAMA

El flujo del sistema actualmente es:

USUARIO
   ↓
Selecciona cine
   ↓
Selecciona película
   ↓
Selecciona horario
   ↓
Selecciona asientos
   ↓
Selecciona productos
   ↓
Realiza el proceso de pago
   ↓
Backend actualiza la reserva
   ↓
MySQL Aiven guarda los datos
   ↓
Se genera el voucher
   ↓
Brevo envía el voucher
   ↓
CORREO DEL CLIENTE
🛠️ Si vuelvo a crear el proyecto desde cero

El orden recomendado es:

Crear el proyecto frontend y backend.
Crear MySQL en Aiven.
Obtener Host, Port, Database, User y Password.
Configurar SSL.
Probar Aiven mediante DBeaver.
Instalar mysql2 en Express.
Crear db.js.
Crear .env.
Conectar Express con Aiven.
Probar primero todo localmente.
Subir el proyecto a GitHub.
Crear el Web Service del backend en Render.
Configurar las variables de entorno en Render.
Desplegar el backend.
Crear/configurar el frontend en Render.
Crear js/config.js para alternar automáticamente entre localhost y Render.
Registrar localhost y el dominio del frontend en Google reCAPTCHA.
Crear una cuenta en Brevo.
Verificar el remitente.
Generar una API Key de Brevo.
Guardar BREVO_API_KEY en .env y Render.
Crear el endpoint /enviar-voucher.
Realizar una compra de prueba.
Revisar los registros en Aiven.
Confirmar la recepción del voucher por correo.
