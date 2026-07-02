export function loginController(req, res) {
  const user = (req.body.usuario || "").trim();
  const pass = (req.body.password || "").trim();

  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (!ADMIN_USER || !ADMIN_PASS) {
    return res.status(500).send("Faltan ADMIN_USER o ADMIN_PASS en .env");
  }

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    return res.status(200).send("OK");
  }

  return res.status(401).send("LOGIN_INVALIDO");
}
