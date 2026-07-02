import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// 📌 VER RESERVAS (ADMIN)
router.get("/reservas", async (_req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        id,
        cine,
        pelicula_titulo,
        tipo_cine,
        sala,
        horario,
        asientos,
        cantidad_entradas,
        monto_entradas,
        nombre_cliente,
        correo_cliente,
        estado,
        fecha_creacion
      FROM reservas
      ORDER BY fecha_creacion DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo reservaciones" });
  }
});

export default router;
