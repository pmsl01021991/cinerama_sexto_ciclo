class PagoFormHandler {
    constructor() {
        this.radios = document.querySelectorAll('input[name="metodo"]');
        this.billeterasDetalle = document.getElementById("billeteras-detalle");
        this.btnPagar = document.getElementById("btn-pagar");

        this.init();
    }

    init() {
        // Mostrar / ocultar la sección de billeteras según el radio
        this.radios.forEach(radio => {
            radio.addEventListener("change", () => this.toggleBilleterasDetalle(radio));
        });

        this.btnPagar.addEventListener("click", (e) => this.procesarPago(e));
    }

    toggleBilleterasDetalle(radio) {
        if (radio.value === "billetera") {
            this.billeterasDetalle.style.display = "block";
        } else {
            this.billeterasDetalle.style.display = "none";
        }
    }

    async procesarPago(e) {
        e.preventDefault();

        const metodoSeleccionado = document.querySelector('input[name="metodo"]:checked');
        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();

        if (!nombre || !correo || !metodoSeleccionado) {
            alert("Por favor complete todos los campos y seleccione un método de pago.");
            return;
        }

        let metodoPago = metodoSeleccionado.value;
        let billeteraUsada = "";

        // Validación extra solo si es billetera
        if (metodoPago === "billetera") {
            const tipoDoc = document.getElementById("tipo-doc").value;
            const numeroDoc = document.getElementById("numero-doc").value.trim();
            const telefono = document.getElementById("telefono").value.trim();
            billeteraUsada = document.getElementById("billetera-usada").value;

            if (!tipoDoc || !numeroDoc || !telefono || !billeteraUsada) {
                alert("Por favor complete los datos de la billetera.");
                return;
            }
        }

        const reservaId = localStorage.getItem("reservaId");
        if (!reservaId) {
            alert("No se encontró la reserva. Vuelve a seleccionar el cine.");
            window.location.href = "index.html#cines";
            return;
        }

        try {
            const resp = await fetch(`http://localhost:3001/api/reservas/${reservaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre_cliente: nombre,
                    correo_cliente: correo,
                    metodo_pago: metodoPago,           // 'tarjeta' o 'billetera'
                    billetera: billeteraUsada || null, // 'Yape', 'Plin' o null
                    estado: "PAGADO"
                })
            });

            if (!resp.ok) throw new Error("Error al registrar el pago");

            // Mensaje opcional
            alert("¡Pago realizado con éxito! 🎟️ Tu compra ha sido registrada.");

            // 👉 En lugar de limpiar y quedarse aquí, redirigimos al voucher
            window.location.href = "voucher.html";

        } catch (err) {
            console.error(err);
            alert("Hubo un problema al procesar el pago.");
        }
    }
}

class BilleteraSelector {
    constructor() {
        this.billeteras = document.querySelectorAll('.opcion-pago');
        this.inputBilletera = document.getElementById('billetera-usada');

        this.init();
    }

    init() {
        this.billeteras.forEach(img => {
            img.addEventListener('click', () => this.seleccionarBilletera(img));
        });
    }

    seleccionarBilletera(img) {
        const billeteraSeleccionada = img.getAttribute('data-billetera');
        this.inputBilletera.value = billeteraSeleccionada;

        this.billeteras.forEach(i => i.classList.remove('seleccionada'));
        img.classList.add('seleccionada');

        // Mostrar QR correspondiente
        document.getElementById("yapeImagenContainer").style.display = "none";
        document.getElementById("plinImagenContainer").style.display = "none";

        if (billeteraSeleccionada === "Yape") {
            document.getElementById("yapeImagenContainer").style.display = "block";
        } else if (billeteraSeleccionada === "Plin") {
            document.getElementById("plinImagenContainer").style.display = "block";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PagoFormHandler();
    new BilleteraSelector();
});
