import bcrypt from "bcrypt";
import { pool } from "../db.js";

export async function loginController(req, res) {
  const usuario = (req.body.usuario || "").trim();
  const password = (req.body.password || "").trim();

  if (!usuario || !password) {
    return res.status(400).json({
      mensaje: "Usuario y contraseña son obligatorios.",
    });
  }

  try {
    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASS = process.env.ADMIN_PASS;

    if (
      usuario === ADMIN_USER &&
      password === ADMIN_PASS
    ) {
      return res.json({
        ok: true,
        usuario: {
          nombre: "Admin",
          correo: ADMIN_USER,
          rol: "ADMIN",
        },
      });
    }

    const [rows] = await pool.execute(
      `SELECT id, nombre, apellidos, correo, password, rol
       FROM usuarios
       WHERE correo = ?`,
      [usuario.toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos.",
      });
    }

    const user = rows[0];

    const passwordCorrecta = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos.",
      });
    }

    return res.json({
      ok: true,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Error login:", error);

    return res.status(500).json({
      mensaje: "Error al iniciar sesión.",
    });
  }
}