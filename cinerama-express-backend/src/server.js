import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import reservasRouter from "./routes/reservas.js";
import path from "path";
import { fileURLToPath } from "url";
import contactoRouter from "./routes/contacto.js";
import adminRouter from "./routes/admin.js";
import usuariosRouter from "./routes/usuarios.js";
import { testConnection } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sirve el frontend desde la carpeta padre de cinerama-express-backend
const FRONT_DIR = path.join(__dirname, "..", "..");

const app = express();


/**
 * CSP para:
 * - reCAPTCHA (google.com / gstatic.com)
 * - EmailJS (api.emailjs.com, cdn.jsdelivr.net)
 * - Trailers YouTube (youtube.com / youtube-nocookie.com)
 * - Imágenes externas (logos) permitiendo cualquier https:
 *
 * ⚠️ Asegúrate de NO tener <meta http-equiv="Content-Security-Policy"> en los HTML.
 */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // evita choques con iframes de terceros en dev
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],

        "script-src": [
          "'self'",
          "'unsafe-inline'",                 // quítalo si eliminas scripts inline
          "https://www.google.com",
          "https://www.gstatic.com",
          "https://cdn.jsdelivr.net",
          "https://www.youtube.com"
        ],

        // iframes permitidos (reCAPTCHA + YouTube)
        "frame-src": [
          "'self'",
          "https://www.google.com",
          "https://www.youtube.com",
          "https://www.youtube-nocookie.com"
        ],
        // compatibilidad antiguos
        "child-src": [
          "'self'",
          "https://www.google.com",
          "https://www.youtube.com",
          "https://www.youtube-nocookie.com"
        ],

        // fetch/XHR (reCAPTCHA/EmailJS)
        "connect-src": [
          "'self'",
          "https://www.google.com",
          "https://www.gstatic.com",
          "https://api.emailjs.com"
        ],

        // ⬅️ Logos externos y miniaturas YouTube
        // (más estricto: reemplaza "https:" por los dominios concretos que uses)
        "img-src": ["'self'", "data:", "https:", "https://i.ytimg.com", "https://www.gstatic.com"],

        // estilos locales + inline (reCAPTCHA inyecta estilos)
        "style-src": ["'self'", "'unsafe-inline'"],

        // fuentes/medios por si los usas desde CDN
        "font-src": ["'self'", "data:", "https:"],
        "media-src": ["'self'", "https:"]
      }
    }
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (solo si abres el front desde otro origen, ej. Live Server)
const origin = process.env.ALLOWED_ORIGIN || "http://127.0.0.1:5500";
app.use(cors({ origin }));

// Archivos estáticos del frontend
app.use(express.static(FRONT_DIR));

// Ruta raíz -> index.html
app.get("/", (_req, res) => {
  res.sendFile(path.join(FRONT_DIR, "index.html"));
});

// Rate limit para la API
app.use("/api", rateLimit({ windowMs: 60_000, max: 60 }));

app.use("/api/reservas", reservasRouter);

app.use("/api/admin", adminRouter);

// Rutas API
app.use("/api/auth", authRouter);
app.use("/api/contacto", contactoRouter);
app.use("/api/usuarios", usuariosRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
  console.log(`Acceso local: http://localhost:${PORT}`);

  try {
    const conectado = await testConnection();

    if (conectado) {
      console.log("✅ MySQL Aiven conectado correctamente");
    }
  } catch (error) {
    console.error("❌ Error conectando a MySQL Aiven:");
    console.error(error.message);
  }
});