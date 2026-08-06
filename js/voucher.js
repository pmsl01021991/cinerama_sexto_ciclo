document.addEventListener("DOMContentLoaded", async () => {
    const reservaId = localStorage.getItem("reservaId");

    if (!reservaId) {
        document.getElementById("v-mensaje-final").textContent =
        "No se encontró ninguna reserva activa.";
        return;
    }

    try {
        const resp = await fetch(`${API_URL}/api/reservas/${reservaId}`);
        if (!resp.ok) throw new Error("Error al obtener la reserva");

        const r = await resp.json();

    // ================================
    // 🍿 CARGAR PRODUCTOS DE LA RESERVA
    // ================================
    try {
    const respProd = await fetch(`${API_URL}/api/reservas/${reservaId}/productos`);
    if (respProd.ok) {
        const productos = await respProd.json();

        const cont = document.getElementById("v-productos");
        const totalEl = document.getElementById("v-total-productos");
        cont.innerHTML = "";
        let total = 0;

        if (productos.length === 0) {
        cont.textContent = "No se compraron productos.";
        } else {
        productos.forEach(p => {
            const linea = document.createElement("p");
            linea.className = "voucher-line";
            linea.textContent = `• ${p.nombre} x${p.cantidad} — S/ ${Number(p.subtotal).toFixed(2)}`;
            cont.appendChild(linea);

            total += Number(p.subtotal);
        });
        }

        // ✅ TOTAL FINAL = entradas + productos
        const totalFinal = Number(r.monto_entradas || 0) + total;
        document.getElementById("v-monto").textContent = totalFinal.toFixed(2);


        totalEl.textContent = total.toFixed(2);
    }
    } catch (err) {
    console.error("Error cargando productos del voucher", err);
    }


        // Rellenar datos
        document.getElementById("v-estado").textContent =
        r.estado === "PAGADO" ? "Estado: PAGADO ✅" : `Estado: ${r.estado}`;

        document.getElementById("v-cine").textContent = r.cine || "-";
        document.getElementById("v-pelicula").textContent = r.pelicula_titulo || "-";
        document.getElementById("v-tipo").textContent = r.tipo_cine || "-";
        document.getElementById("v-horario").textContent = r.horario || "-";
        document.getElementById("v-asientos").textContent = r.asientos || "-";
        document.getElementById("v-cantidad").textContent = r.cantidad_entradas ?? "-";
        document.getElementById("v-nombre").textContent = r.nombre_cliente || "-";
        document.getElementById("v-correo").textContent = r.correo_cliente || "-";
        document.getElementById("v-metodo").textContent =
        r.metodo_pago === "billetera" && r.billetera
            ? `Billetera (${r.billetera})`
            : (r.metodo_pago || "-");

        // ================================
        //  ENVIAR AUTOMÁTICAMENTE EL VOUCHER
        // ================================
        async function enviarVoucher() {
            try {
                const resp = await fetch(`${API_URL}/api/reservas/${reservaId}/enviar-voucher`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });

                const data = await resp.json();
                console.log("Correo enviado:", data);
            } catch (err) {
                console.error("Error enviando correo:", err);
            }
        }

        // Llamamos a la función
        enviarVoucher();

        // Botón para regresar al inicio
        document.getElementById("btnCerrarVoucher").addEventListener("click", () => {

            // Limpia la reserva para que empiece otra desde 0
            localStorage.removeItem("reservaId");
            localStorage.removeItem("dataCine");
            localStorage.removeItem("horarioSeleccionado");
            localStorage.removeItem("tipoCine");
            localStorage.removeItem("asientosSeleccionados");

            // Redirige a la interfaz inicial
            window.location.href = "index.html";
        });


    } catch (err) {
        console.error(err);
        document.getElementById("v-mensaje-final").textContent =
        "Hubo un problema al cargar el voucher.";
    }
});
