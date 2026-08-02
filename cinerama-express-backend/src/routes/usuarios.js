import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../db.js";

const router = express.Router();

// ======================================================
// POST /api/usuarios/registro
// REGISTRAR NUEVO USUARIO
// ======================================================

router.post("/registro", async (req, res) => {
  const {
    nombre,
    apellidos,
    correo,
    telefono,
    password,
  } = req.body;

  // ====================================================
  // VALIDAR CAMPOS
  // ====================================================

  if (
    !nombre?.trim() ||
    !apellidos?.trim() ||
    !correo?.trim() ||
    !telefono?.trim() ||
    !password
  ) {
    return res.status(400).json({
      mensaje: "Todos los campos son obligatorios.",
    });
  }

  try {
    // ==================================================
    // VERIFICAR SI EL CORREO YA EXISTE
    // ==================================================

    const [usuarios] = await pool.execute(
      `SELECT id
       FROM usuarios
       WHERE correo = ?`,
      [correo.trim().toLowerCase()]
    );

    if (usuarios.length > 0) {
      return res.status(409).json({
        mensaje: "Ya existe una cuenta con este correo.",
      });
    }

    // ==================================================
    // ENCRIPTAR CONTRASEÑA
    // ==================================================

    const passwordHash = await bcrypt.hash(password, 10);

    // ==================================================
    // CREAR USUARIO
    // ==================================================

    const [resultado] = await pool.execute(
      `INSERT INTO usuarios
       (
         nombre,
         apellidos,
         correo,
         telefono,
         password,
         rol
       )
       VALUES (?, ?, ?, ?, ?, 'USUARIO')`,
      [
        nombre.trim(),
        apellidos.trim(),
        correo.trim().toLowerCase(),
        telefono.trim(),
        passwordHash,
      ]
    );

    // ==================================================
    // RESPUESTA
    // ==================================================

    return res.status(201).json({
      ok: true,
      mensaje: "Cuenta creada correctamente.",
      usuario: {
        id: resultado.insertId,
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim().toLowerCase(),
        rol: "USUARIO",
      },
    });
  } catch (error) {
    console.error("Error registrando usuario:", error);

    return res.status(500).json({
      mensaje: "Error al crear la cuenta.",
    });
  }
});

export default router;