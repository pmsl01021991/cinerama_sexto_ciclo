import axios from "axios";

export async function verifyCaptcha(req, res, next) {
  try {
    const token =
      req.body["g-recaptcha-response"] ||
      req.body.token ||
      req.body.captcha ||
      "";

    if (!token) return res.status(400).send("Captcha no enviado");

    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) return res.status(500).send("Falta RECAPTCHA_SECRET en .env");

    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);

    const { data } = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (!data?.success) {
      return res.status(400).send("Captcha inválido");
    }

    next();
  } catch (err) {
    console.error("Captcha error:", err?.message || err);
    res.status(500).send("Error de verificación de captcha");
  }
}
