import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Guardar mensaje
router.post("/", async (req, res) => {
  const { nombre, apellidos, email, asunto, cine, mensaje } = req.body;

  try {
    await pool.execute(
      `INSERT INTO mensajes_contacto
        (nombre, apellidos, email, asunto, cine, mensaje)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, apellidos, email, asunto, cine, mensaje]
        );

        res.json({ ok: true });
    } catch (err) {
        console.error("Error guardando mensaje:", err);
        res.status(500).json({ error: "Error guardando mensaje" });
    }
});

// Listar mensajes (ADMIN)
router.get("/", async (_req, res) => {
    try {
        const [rows] = await pool.execute(
        "SELECT * FROM mensajes_contacto ORDER BY fecha DESC"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error obteniendo mensajes" });
    }
});

export default router;
