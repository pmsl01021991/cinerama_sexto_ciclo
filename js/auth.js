// js/auth.js
document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = localStorage.getItem("adminLogeado") === "true";
    const requireAdmin = document.body?.dataset?.requireAdmin === "true";

    // 1) Si la página requiere admin y no está logeado → manda a login
    if (requireAdmin && !isAdmin) {
        window.location.href = "login.html";
        return;
    }

    // 2) Muestra/oculta elementos marcados como "solo admin"
    document.querySelectorAll("[data-admin-only]").forEach((el) => {
        if (isAdmin) {
        el.hidden = false;
        el.style.display = ""; // deja que el CSS decida
        } else {
        el.hidden = true;
        el.style.display = "none";
        }
    });

    // 3) Opcional: oculta el link de login si ya es admin
    const loginLink = document.getElementById("loginLink");
    if (loginLink) loginLink.style.display = isAdmin ? "none" : "";

    // 4) Botón cerrar sesión (si existe)
    const logoutBtn = document.getElementById("cerrarSesionBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("adminLogeado");
        window.location.href = "index.html";
        });
    }
});
