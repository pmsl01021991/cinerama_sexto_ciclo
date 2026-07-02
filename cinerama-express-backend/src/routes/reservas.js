// src/routes/reservas.js
import express from "express";
import { pool } from "../db.js";
import nodemailer from "nodemailer";

const router = express.Router();

/**
 * POST /api/reservas
 * Crea la reserva cuando el usuario elige el CINE
 */
router.post("/", async (req, res) => {
  const { cine } = req.body;

  if (!cine) {
    return res.status(400).json({ error: "El campo 'cine' es obligatorio" });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO reservas (cine, estado) VALUES (?, 'RESERVADO')",
      [cine]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    console.error("Error al crear reserva:", err);
    res.status(500).json({ error: "Error al crear la reserva" });
  }
});

/**
 * GET /api/reservas/:id
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM reservas WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener reserva:", err);
    res.status(500).json({ error: "Error al obtener la reserva" });
  }
});

/**
 * PUT /api/reservas/:id
 * Actualiza datos de la reserva
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const {
    funcion_id,
    pelicula_codigo,
    pelicula_titulo,
    tipo_cine,
    sala,
    horario,
    asientos,
    cantidad_entradas,
    monto_entradas,
    nombre_cliente,
    correo_cliente,
    metodo_pago,
    billetera,
    estado,
  } = req.body;

  /* ======================================================
     🔒 BLOQUEO REAL DE ASIENTOS (BACKEND)
     ====================================================== */
  if (asientos !== undefined) {
    const [[actual]] = await pool.execute(
      `SELECT cine, pelicula_titulo, sala, horario
       FROM reservas
       WHERE id = ?`,
      [id]
    );

    if (!actual) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    const solicitados = String(asientos)
      .split(",")
      .map(a => a.trim())
      .filter(Boolean);

    if (solicitados.length > 0) {
      const [rows] = await pool.execute(
        `SELECT asientos
         FROM reservas
         WHERE cine = ?
           AND pelicula_titulo = ?
           AND sala = ?
           AND horario = ?
           AND estado IN ('RESERVADO', 'PAGADO')
           AND id <> ?`,
        [
          actual.cine,
          actual.pelicula_titulo,
          actual.sala,
          actual.horario,
          id
        ]
      );

      const ocupados = rows
        .map(r => r.asientos)
        .filter(Boolean)
        .flatMap(a => a.split(",").map(x => x.trim()));

      const conflicto = solicitados.filter(a => ocupados.includes(a));

      if (conflicto.length > 0) {
        return res.status(409).json({
          error: "Asientos ya ocupados",
          ocupados: conflicto
        });
      }
    }
  }

  /* ======================================================
     UPDATE DINÁMICO
     ====================================================== */
  const campos = [];
  const valores = [];

  if (funcion_id !== undefined) { campos.push("funcion_id = ?"); valores.push(funcion_id); }
  if (pelicula_codigo !== undefined) { campos.push("pelicula_codigo = ?"); valores.push(pelicula_codigo); }
  if (pelicula_titulo !== undefined) { campos.push("pelicula_titulo = ?"); valores.push(pelicula_titulo); }
  if (tipo_cine !== undefined) { campos.push("tipo_cine = ?"); valores.push(tipo_cine); }
  if (sala !== undefined) { campos.push("sala = ?"); valores.push(sala); }
  if (horario !== undefined) { campos.push("horario = ?"); valores.push(horario); }
  if (asientos !== undefined) { campos.push("asientos = ?"); valores.push(asientos); }
  if (cantidad_entradas !== undefined) { campos.push("cantidad_entradas = ?"); valores.push(cantidad_entradas); }
  if (monto_entradas !== undefined) { campos.push("monto_entradas = ?"); valores.push(monto_entradas); }
  if (nombre_cliente !== undefined) { campos.push("nombre_cliente = ?"); valores.push(nombre_cliente); }
  if (correo_cliente !== undefined) { campos.push("correo_cliente = ?"); valores.push(correo_cliente); }
  if (metodo_pago !== undefined) { campos.push("metodo_pago = ?"); valores.push(metodo_pago); }
  if (billetera !== undefined) { campos.push("billetera = ?"); valores.push(billetera); }
  if (estado !== undefined) { campos.push("estado = ?"); valores.push(estado); }

  if (campos.length === 0) {
    return res.status(400).json({ error: "No hay campos para actualizar" });
  }

  valores.push(id);

  try {
    await pool.execute(
      `UPDATE reservas SET ${campos.join(", ")} WHERE id = ?`,
      valores
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Error al actualizar reserva:", err);
    res.status(500).json({ error: "Error al actualizar la reserva" });
  }
});

/**
 * ✅ GET /api/reservas/ocupados/:cine/:pelicula/:sala/:horario
 * DEVUELVE ASIENTOS RESERVADOS Y PAGADOS
 */
router.get("/ocupados/:cine/:pelicula/:sala/:horario", async (req, res) => {
  try {
    const { cine, pelicula, sala, horario } = req.params;

    const [rows] = await pool.execute(
      `SELECT asientos
       FROM reservas
       WHERE cine = ?
         AND UPPER(pelicula_titulo) = UPPER(?)
         AND sala = ?
         AND horario = ?
         AND estado IN ('RESERVADO','PAGADO')`,
      [cine, pelicula, sala, horario]
    );

    const ocupados = rows
      .map(r => r.asientos)
      .filter(Boolean)
      .flatMap(a => a.split(",").map(x => x.trim()));

    res.json({ ocupados });
  } catch (err) {
    console.error("Error cargando asientos ocupados:", err);
    res.status(500).json({ error: "Error cargando asientos ocupados" });
  }
});


/* ======================================================
   PRODUCTOS + VOUCHER (SIN CAMBIOS)
   ====================================================== */

router.post("/:id/productos", async (req, res) => {
  const { id } = req.params;
  const { productos } = req.body;

  if (!Array.isArray(productos) || productos.length === 0) {
    return res.json({ ok: true });
  }

  try {
    await pool.execute(
      "DELETE FROM productos_reserva WHERE reserva_id = ?",
      [id]
    );

    for (const p of productos) {
      const subtotal = p.precio_unitario * p.cantidad;

      await pool.execute(
        `INSERT INTO productos_reserva
         (reserva_id, producto_id, cantidad, subtotal)
         VALUES (?, ?, ?, ?)`,
        [id, p.producto_id, p.cantidad, subtotal]
      );
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Error guardando productos:", err);
    res.status(500).json({ error: "Error guardando productos" });
  }
});

router.get("/:id/productos", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      `SELECT p.nombre, pr.cantidad, pr.subtotal
       FROM productos_reserva pr
       JOIN productos p ON pr.producto_id = p.id
       WHERE pr.reserva_id = ?`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error obteniendo productos:", err);
    res.status(500).json({ error: "Error obteniendo productos" });
  }
});

export default router;
