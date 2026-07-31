class AsientosHandler {
    constructor() {
        this.seleccionado = 0;
        this.entrada = 12;
        this.butacasSeleccionadasArray = [];

        this.setupBaseEventListeners();
        this.renderizarData();
    }

    setupBaseEventListeners() {
        document.getElementById('alerta-confirmar')
            .addEventListener('click', () => this.confirmarCompra());

        document.getElementById('alerta-continuar')
            .addEventListener('click', () => this.cerrarModal());

        document.getElementById('btn-atras')
            .addEventListener('click', () => this.abrirModal());

        document.getElementById('btn-continuar')
            .addEventListener('click', () => this.continuarCompra());
    }

    confirmarCompra() {
        const dataCine = JSON.parse(localStorage.getItem('dataCine'));
        localStorage.removeItem('dataCompra');
        window.location.replace(dataCine.url);
    }

    cerrarModal() {
        document.getElementById('modal-alert-salir').classList.add('remove');
    }

    abrirModal() {
        document.getElementById('modal-alert-salir').classList.remove('remove');
    }

    renderizarData() {
        const dataCine = JSON.parse(localStorage.getItem('dataCine'));
        const hora = localStorage.getItem('horarioSeleccionado');
        const tipoCine = localStorage.getItem('tipoCine');

        const fecha = new Intl.DateTimeFormat('es-ES', {
            day: 'numeric', month: 'short', year: 'numeric'
        }).format(new Date());

        document.getElementById('img-pelicula').src = dataCine.poster;
        document.getElementById('titulo').textContent = dataCine.titulo;
        document.getElementById('tipo-pelicula').textContent = `${tipoCine} Entrada Regular`;
        document.getElementById('fecha-actual').textContent = `📅 Hoy, ${fecha}`;
        document.getElementById('hora').textContent = `⏱️ ${hora}`;
        document.getElementById('sala').textContent = `🔴 SALA ${dataCine.sala}`;
    }

    setupSeatEventListeners() {
        document.querySelectorAll('.asiento-box:not(.asiento-ocupado)').forEach(asiento => {
            asiento.addEventListener('click', () => this.toggleAsiento(asiento));
        });
    }

    toggleAsiento(asiento) {
        const codigo = asiento.dataset.asiento;

        if (asiento.classList.toggle('box-select')) {
            this.seleccionado++;
            this.butacasSeleccionadasArray.push(codigo);
            asiento.querySelector('.emoji-asiento').textContent = '🧍‍♂️🪑';
        } else {
            this.seleccionado--;
            this.butacasSeleccionadasArray =
                this.butacasSeleccionadasArray.filter(b => b !== codigo);
            asiento.querySelector('.emoji-asiento').textContent = '🪑';
        }

        document.getElementById('total-pagar').textContent =
            `${this.seleccionado * this.entrada}.00`;
        document.getElementById('total-entrada').textContent = this.seleccionado;
        document.getElementById('butacas-seleccionadas').textContent =
            this.butacasSeleccionadasArray.join(', ');

        const btn = document.getElementById('btn-continuar');
        btn.disabled = this.seleccionado === 0;
        btn.classList.toggle('bloquear', this.seleccionado === 0);
    }

    async continuarCompra() {
        const reservaId = localStorage.getItem("reservaId");

        try {
            const resp = await fetch(`http://localhost:3001/api/reservas/${reservaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    asientos: this.butacasSeleccionadasArray.join(", "),
                    cantidad_entradas: this.seleccionado,
                    monto_entradas: this.seleccionado * this.entrada,
                    estado: "RESERVADO"
                })
            });

            if (resp.status === 409) {
                const data = await resp.json();
                alert(`❌ El asiento ${data.ocupados.join(", ")} ya está ocupado.`);
                window.location.reload();
                return;
            }

            if (!resp.ok) throw new Error();

            window.location.href = "comida.html";
        } catch {
            alert("No se pudo guardar la selección de asientos.");
        }
    }

    renderizarTextoAsientos() {
        document.querySelectorAll('.asiento-box').forEach(asiento => {
            // ⛔ NO reescribir si ya está ocupado
            if (asiento.classList.contains('asiento-ocupado')) return;

            asiento.innerHTML = `
                <span class="emoji-asiento">🪑</span>
                <span class="asiento-codigo">${asiento.dataset.asiento}</span>
            `;
        });
    }
}

/* ========================== */
document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("asientos-container");
    const handler = new AsientosHandler();

    const salas = await fetch(".vscode/salas.json").then(r => r.json());
    const tipoSala = localStorage.getItem("tipoCine") || "2D";
    const config = salas[tipoSala];

    generarAsientos(config.filas, config.columnas);

    // ⬇️ ORDEN CORRECTO
    handler.renderizarTextoAsientos();
    await marcarAsientosOcupados();
    handler.setupSeatEventListeners();

    async function marcarAsientosOcupados() {
        const dataCine = JSON.parse(localStorage.getItem("dataCine"));
        const horario = localStorage.getItem("horarioSeleccionado");

        const url = `http://localhost:3001/api/reservas/ocupados/${encodeURIComponent(dataCine.cine)}/${encodeURIComponent(dataCine.titulo)}/${dataCine.sala}/${encodeURIComponent(horario)}`;

        console.log("dataCine:", dataCine);
        console.log("URL:", url);

        const resp = await fetch(url);

        const data = await resp.json();

        console.log("OCUPADOS:", data);

        data.ocupados.forEach(cod => {
            const asiento = document.querySelector(
                `.asiento-box[data-asiento="${cod}"]`
            );

            if (asiento) {
                asiento.classList.add("asiento-ocupado");

                asiento.innerHTML = `
                    <span style="font-size:1.2rem">❌</span>
                    <span class="asiento-codigo">${cod}</span>
                `;

                asiento.style.pointerEvents = "none";
            }
        });
    }
    function generarAsientos(filas, columnas) {
        contenedor.innerHTML = "";
        for (let i = 0; i < filas; i++) {
            const fila = document.createElement("div");
            fila.classList.add("asientos-fila");
            const letra = String.fromCharCode(65 + i);

            for (let j = 1; j <= columnas; j++) {
                const asiento = document.createElement("div");
                asiento.classList.add("asiento-box");
                asiento.dataset.asiento = `${letra}${j}`;
                fila.appendChild(asiento);
            }
            contenedor.appendChild(fila);
        }
    }
});
