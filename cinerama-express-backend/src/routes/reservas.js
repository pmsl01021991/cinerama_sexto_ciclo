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
         AND estado='PAGADO'`,
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

router.post("/:id/enviar-voucher", async (req, res) => {
  const { id } = req.params;

  try {
    const [[r]] = await pool.execute(
      "SELECT * FROM reservas WHERE id = ?",
      [id]
    );

    if (!r) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    const [productos] = await pool.execute(
      `SELECT p.nombre, pr.cantidad, pr.subtotal
       FROM productos_reserva pr
       JOIN productos p ON pr.producto_id = p.id
       WHERE pr.reserva_id = ?`,
      [id]
    );

    let htmlProductos = "";
    let totalProductos = 0;

    if (productos.length === 0) {
      htmlProductos = "<p>No se compraron productos.</p>";
    } else {
      productos.forEach(p => {
        totalProductos += Number(p.subtotal);
        htmlProductos += `
          <p>• ${p.nombre} x${p.cantidad} — S/ ${Number(p.subtotal).toFixed(2)}</p>
        `;
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"CINERAMA" <${process.env.EMAIL_USER}>`,
      to: r.correo_cliente,
      subject: "🎟️ Confirmación de compra - CINERAMA",
      html: `
    <!DOCTYPE html>
    <html lang="es">
    <head>
    <meta charset="UTF-8">
    </head>

    <body style="
    margin:0;
    padding:40px;
    background:#f3f3f3;
    font-family:Arial, Helvetica, sans-serif;">

    <div style="
    max-width:650px;
    margin:auto;
    background:white;
    border-radius:15px;
    overflow:hidden;
    box-shadow:0 10px 25px rgba(0,0,0,.15);">

    <!-- ENCABEZADO -->

    <div style="
    background:#151515;
    padding:25px;
    text-align:center;">

    <h1 style="
    margin:0;
    font-size:34px;
    color:#d9d93b;
    letter-spacing:2px;">

    🎬 CINERAMA

    </h1>

    <p style="
    color:white;
    margin-top:8px;">

    Tu compra fue realizada con éxito

    </p>

    </div>

    <!-- CUERPO -->

    <div style="padding:35px;">

    <h2 style="
    text-align:center;
    margin-top:0;
    color:#0f172a;">

    🎟️ Voucher de Compra

    </h2>

    <div style="
    background:#f7f7f7;
    padding:18px;
    border-radius:10px;
    border-left:6px solid #2ecc71;
    margin-bottom:20px;">

    <h3 style="
    margin:0;
    color:#2ecc71;">

    ✅ Estado: PAGADO

    </h3>

    </div>

    <table width="100%" cellspacing="8">

    <tr>
    <td><b>📍 Cine</b></td>
    <td>${r.cine}</td>
    </tr>

    <tr>
    <td><b>🎬 Película</b></td>
    <td>${r.pelicula_titulo}</td>
    </tr>

    <tr>
    <td><b>🎞️ Tipo</b></td>
    <td>${r.tipo_cine}</td>
    </tr>

    <tr>
    <td><b>🕒 Horario</b></td>
    <td>${r.horario}</td>
    </tr>

    <tr>
    <td><b>🪑 Asientos</b></td>
    <td>${r.asientos}</td>
    </tr>

    <tr>
    <td><b>🎟️ Entradas</b></td>
    <td>${r.cantidad_entradas}</td>
    </tr>

    </table>

    <hr style="margin:30px 0;">

    <h3 style="color:#d35400;">
    🍿 Productos Comprados
    </h3>

    ${
    productos.length===0
    ?`
    <p>No se compraron productos.</p>
    `
    :
    productos.map(p=>`
    <div style="
    display:flex;
    justify-content:space-between;
    padding:10px;
    background:#fafafa;
    margin-bottom:8px;
    border-radius:8px;">

    <span>

    ${p.nombre}

    x${p.cantidad}

    </span>

    <span>

    S/ ${Number(p.subtotal).toFixed(2)}

    </span>

    </div>
    `).join("")
    }

    <div style="
    margin-top:15px;
    padding:15px;
    background:#fff8e1;
    border-radius:8px;">

    <p style="margin:4px;">
    <b>Total productos:</b>
    S/ ${totalProductos.toFixed(2)}
    </p>

    <p style="margin:4px;">
    <b>Total entradas:</b>
    S/ ${Number(r.monto_entradas).toFixed(2)}
    </p>

    <h2 style="
    margin-top:18px;
    color:#0b8457;">

    💳 TOTAL PAGADO

    <br>

    S/ ${(Number(r.monto_entradas)+totalProductos).toFixed(2)}

    </h2>

    </div>

    <hr style="margin:30px 0;">

    <h3>👤 Datos del Cliente</h3>

    <table width="100%" cellspacing="8">

    <tr>
    <td><b>Nombre</b></td>
    <td>${r.nombre_cliente}</td>
    </tr>

    <tr>
    <td><b>Correo</b></td>
    <td>${r.correo_cliente}</td>
    </tr>

    <tr>
    <td><b>Método</b></td>
    <td>${r.metodo_pago==="billetera"
    ?`Billetera (${r.billetera})`
    :r.metodo_pago}</td>
    </tr>

    </table>

    <div style="
    margin-top:35px;
    padding:20px;
    background:#e8f5e9;
    border-radius:10px;
    text-align:center;">

    <h2 style="
    margin:0;
    color:#2e7d32;">

    💚 Gracias por elegir CINERAMA

    </h2>

    <p style="margin-top:10px;">

    Esperamos verte nuevamente.

    Disfruta tu película.

    🍿🎬

    </p>

    </div>

    </div>

    <div style="
    background:#151515;
    padding:15px;
    text-align:center;
    color:#ccc;
    font-size:13px;">

    © 2026 CINERAMA

    <br>

    Este correo fue generado automáticamente.

    </div>

    </div>

    </body>
    </html>
    `
    });

    res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error enviando correo" });
  }
});

export default router;
