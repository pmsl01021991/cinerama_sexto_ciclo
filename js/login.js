// js/login.js

// Inicializa EmailJS SOLO en la página de login
document.addEventListener("DOMContentLoaded", () => {
  const isLoginPage = !!document.getElementById("LoginForm");
  if (isLoginPage && window.emailjs && typeof emailjs.init === "function") {
    try { emailjs.init("nFJQXJun_0mdXBQ6U"); } catch (_) {}
  }

  // Validación de acceso administrador con modal
  const requireAdmin = document.body?.dataset?.requireAdmin === "true";
  if (requireAdmin && localStorage.getItem("adminLogeado") !== "true") {
    // Guardamos un flag para mostrar el modal en index.html
    localStorage.setItem("showRestrictedModal", "true");
    window.location.href = "index.html";
  }
});

class LoginForm {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.usuarioInput = document.getElementById("usuario");
    this.passwordInput = document.getElementById("password");
    this.mensajeError = document.getElementById("mensajeError");
    this.submitBtn = this.form?.querySelector('button[type="submit"]');
    this.loading = false;
    this.init();
  }

  init() {
    if (!this.form) return;
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.enviarFormulario();
    });
  }

  setLoading(loading) {
    this.loading = !!loading;
    if (this.submitBtn) {
      this.submitBtn.disabled = this.loading;
      this.submitBtn.textContent = this.loading ? "Procesando..." : "Iniciar sesión";
    }
  }

  enviarFormulario() {
  if (this.loading) return;

  const user = (this.usuarioInput?.value || "").trim();
  const pass = (this.passwordInput?.value || "").trim();

  if (!user || !pass) {
    this.mensajeError.textContent = "Por favor completa todos los campos.";
    return;
  }

  if (typeof grecaptcha === "undefined") {
    this.mensajeError.textContent = "No se pudo cargar el captcha. Recarga la página.";
    return;
  }

  const token = grecaptcha.getResponse();
  if (!token) {
    this.mensajeError.textContent = "Completa el captcha.";
    return;
  }

  this.setLoading(true);
this.mensajeError.textContent = "";

// Usuario administrador hardcodeado
const adminUser = "admin@cinerama.com";
const adminPass = "pmsl123";

// Si el usuario NO es admin, redirigir con modal
if (user !== adminUser || pass !== adminPass) {
  localStorage.setItem("showRestrictedModal", "true");
  try { grecaptcha.reset(); } catch (_) {}
  window.location.href = "index.html";
  return; // detener ejecución del login
}

// Si es admin, proceder con el fetch normal
const url = "/api/auth/login"; 
fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    usuario: user,
    password: pass,
    "g-recaptcha-response": token,
  }),
})
  .then(async (res) => {
    const text = await res.text();

    if (res.ok && text === "OK") {
      localStorage.setItem("adminLogeado", "true");
      try { grecaptcha.reset(); } catch (_) {}
      window.location.href = "index.html";
      return;
    }

    // Si falla login
    const intentos = JSON.parse(localStorage.getItem("intentosFallidos")) || [];
    intentos.push({ usuario: user, fecha: new Date().toLocaleString() });
    localStorage.setItem("intentosFallidos", JSON.stringify(intentos));
    this.mensajeError.textContent = text || "Login inválido";
    try { grecaptcha.reset(); } catch (_) {}
  })
  .catch((err) => {
    console.error("❌ Fetch error:", err);
    this.mensajeError.textContent = "Error de conexión.";
    try { grecaptcha.reset(); } catch (_) {}
  })
  .finally(() => this.setLoading(false));

}

}

new LoginForm("#LoginForm");

// Panel de administración
class AdminPanel {
  constructor() {
    this.logoutButton = document.getElementById("cerrarSesionBtn");
    this.initEventos();
  }

  initEventos() {
    if (this.logoutButton) {
      this.logoutButton.addEventListener("click", () => this.cerrarSesion());
    }
  }

  cerrarSesion() {
    localStorage.removeItem("adminLogeado");
    window.location.href = "index.html";
  }
}

if (document.getElementById("cerrarSesionBtn")) {
  new AdminPanel();
}

// Mostrar modal de acceso restringido en index.html
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("showRestrictedModal") === "true") {
    localStorage.removeItem("showRestrictedModal");

    // Crear modal simple
    const modal = document.createElement("div");
    modal.id = "restrictedModal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.5)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "9999";

    const content = document.createElement("div");
    content.style.background = "#fff";
    content.style.padding = "2rem";
    content.style.borderRadius = "8px";
    content.style.textAlign = "center";
    content.innerHTML = `
      <h2>⚠️ Cuidado</h2>
      <p>Acceso restringido. Solo administradores pueden entrar.</p>
      <button id="closeModalBtn" style="margin-top:1rem;padding:0.5rem 1rem;">Cerrar</button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    document.getElementById("closeModalBtn").addEventListener("click", () => {
      modal.remove();
    });
  }
});
