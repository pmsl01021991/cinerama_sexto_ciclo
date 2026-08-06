class ComidaPage {
  constructor() {
    this.grid = document.getElementById("productosGrid");

    // resumen
    this.rEntradas = document.getElementById("r-entradas");
    this.rButacas = document.getElementById("r-butacas");
    this.rProductos = document.getElementById("r-productos");
    this.rTotalProductos = document.getElementById("r-totalProductos");

    this.btnSaltar = document.getElementById("btn-saltar");
    this.btnContinuar = document.getElementById("btn-continuar");
    this.btnAtras = document.getElementById("btn-atras");

    // carrito
    this.cart = this.loadCart();

    // productos (bonitos con imágenes)
    this.productos = [
      {
        id: 1,
        nombre: "Combo Pollo",
        categoria: "Combo",
        precio: 25.00,
        desc: "Pollo + papas + gaseosa mediana",
        img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=60"
      },
      {
        id: 2,
        nombre: "Combo Nachos",
        categoria: "Combo",
        precio: 18.00,
        desc: "Nachos con queso + gaseosa",
        img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=60"
      },
      {
        id: 3,
        nombre: "Gaseosa",
        categoria: "Bebida",
        precio: 6.00,
        desc: "Coca-Cola / Inka Kola / Sprite (mediana)",
        img: "https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&w=900&q=60"
      },
      {
        id: 4,
        nombre: "Agua",
        categoria: "Bebida",
        precio: 4.00,
        desc: "Agua sin gas (500ml)",
        img: "imagenes/aguasingas.webp"
      },
      {
        id: 5,
        nombre: "Galletas",
        categoria: "Snack",
        precio: 4.00,
        desc: "Pack de galletas dulces",
        img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=60"
      },
      {
        id: 6,
        nombre: "Popcorn Grande",
        categoria: "Snack",
        precio: 12.00,
        desc: "Cancha grande (mantequilla opcional)",
        img: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=900&q=60"
      }
    ];
  }

  start() {
    // 🧹 LIMPIAR CARRITO DE COMIDA SI ES UNA NUEVA COMPRA
    localStorage.removeItem("productos");
    localStorage.removeItem("productosResumen");
    localStorage.removeItem("totalProductos");

    // resetear carrito en memoria
    this.cart = [];
    this.renderMovieInfo();
    this.renderGrid();
    this.renderResumen();

    this.btnSaltar.addEventListener("click", () => this.goPago(true));
    this.btnContinuar.addEventListener("click", () => this.goPago(false));
    this.btnAtras.addEventListener("click", () => window.location.href = "asientos.html");
  }

  // --- movie info (reutiliza tu localStorage como asientos.js) ---
  renderMovieInfo() {
    const dataCine = JSON.parse(localStorage.getItem('dataCine'));
    const horaSeleccionado = localStorage.getItem('horarioSeleccionado');
    const tipoCine = localStorage.getItem('tipoCine');

    if (!dataCine || !horaSeleccionado || !tipoCine) {
      alert("No se encontraron datos de la compra. Vuelve a seleccionar asientos.");
      window.location.href = "index.html";
      return;
    }

    const hoy = new Date();
    const formatear = new Intl.DateTimeFormat('es-ES', { day:'numeric', month:'short', year:'numeric' });
    const fechaActualFormateada = `Hoy, ${formatear.format(hoy)}`;

    document.getElementById('img-pelicula').src = dataCine.poster;
    document.getElementById('titulo').textContent = dataCine.titulo;
    document.getElementById('tipo-pelicula').textContent = `${tipoCine} Entrada Regular`;
    document.getElementById('fecha-actual').textContent = `📅 ${fechaActualFormateada}`;
    document.getElementById('hora').textContent = `⏱️ ${horaSeleccionado}`;
    document.getElementById('sala').textContent = `🔴 SALA ${dataCine.sala}`;

    // resumen entradas/butacas (viene de reservas, pero tú lo guardas en BD)
    // Por ahora lo tomamos de la última selección de asientos (local)
    const butacas = (localStorage.getItem("asientosSeleccionados") || "").trim();
    // si no tienes esa key, usamos lo que se guardó en reservas (igual funciona solo con total=0)
    const entradas = localStorage.getItem("cantidadEntradas") || "0";

    this.rEntradas.textContent = entradas;
    this.rButacas.textContent = butacas || "-";
  }

  // --- grid ---
  renderGrid() {
    this.grid.innerHTML = "";

    this.productos.forEach(p => {
      const qty = this.getQty(p.id);

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${p.img}" alt="${p.nombre}">
        <div class="card-body">
          <div class="card-title">${p.nombre}</div>
          <div class="card-desc">${p.desc}</div>

          <div class="card-foot">
            <div class="price">S/ ${p.precio.toFixed(2)}</div>

            <div class="qty">
              <button data-action="minus" data-id="${p.id}">−</button>
              <span id="qty-${p.id}">${qty}</span>
              <button data-action="plus" data-id="${p.id}">+</button>
            </div>
          </div>

          <button class="add-btn" data-action="add" data-id="${p.id}">
            Agregar al carrito
          </button>
        </div>
      `;

      card.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const id = Number(btn.dataset.id);
        const action = btn.dataset.action;

        if (action === "plus") this.changeQty(id, +1);
        if (action === "minus") this.changeQty(id, -1);
        if (action === "add") this.addToCart(id, card, btn);
      });

      this.grid.appendChild(card);
    });
  }

  // --- carrito helpers ---
  loadCart() {
    try {
      return JSON.parse(localStorage.getItem("productos") || "[]");
    } catch {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem("productos", JSON.stringify(this.cart));
  }

  getQty(productoId) {
    const item = this.cart.find(x => x.producto_id === productoId);
    return item ? item.cantidad : 0;
  }

  changeQty(productoId, delta) {
    const item = this.cart.find(x => x.producto_id === productoId);

    if (!item) {
      if (delta > 0) {
        this.cart.push({ producto_id: productoId, cantidad: 1 });
      }
    } else {
      item.cantidad += delta;
      if (item.cantidad <= 0) {
        this.cart = this.cart.filter(x => x.producto_id !== productoId);
      }
    }

    this.saveCart();
    this.updateQtyUI(productoId);
    this.renderResumen();
  }

  updateQtyUI(productoId) {
    const el = document.getElementById(`qty-${productoId}`);
    if (el) {
        el.textContent = String(this.getQty(productoId));
    }
  }


  addToCart(productoId, card, btn) {
    // si qty=0, lo ponemos a 1
    const item = this.cart.find(x => x.producto_id === productoId);
    if (!item) this.cart.push({ producto_id: productoId, cantidad: 1 });

    this.saveCart();
    this.updateQtyUI(productoId);
    this.renderResumen();

    // ✅ ANIMACIÓN (AQUÍ VA EXACTO)
    if (card && btn) {
        card.classList.add("agregado");
        btn.classList.add("ok");
        btn.textContent = "Agregado ✔";

        setTimeout(() => {
        card.classList.remove("agregado");
        btn.classList.remove("ok");
        btn.textContent = "Agregar al carrito";
        }, 800);
    }
  }

  calcTotalProductos() {
    let total = 0;

    this.cart.forEach(ci => {
        const prod = this.productos.find(p => p.id === ci.producto_id);
        if (prod) {
        total += prod.precio * ci.cantidad;
        }
    });

    return total;
    }



  renderResumen() {
    const total = this.calcTotalProductos();

    const nombres = this.cart
      .map(ci => {
        const prod = this.productos.find(p => p.id === ci.producto_id);
        return prod ? `${prod.nombre} x${ci.cantidad}` : null;
      })
      .filter(Boolean);

    this.rProductos.textContent = nombres.length ? nombres.join(", ") : "Ninguno";
    this.rTotalProductos.textContent = total.toFixed(2);

    // guardo también un resumen para el voucher si quieres
    localStorage.setItem("productosResumen", this.rProductos.textContent);
    localStorage.setItem("totalProductos", total.toFixed(2));
  }

    // --- guardar productos en BD ---
  async guardarProductosBD() {
    const reservaId = localStorage.getItem("reservaId");
    if (!reservaId || this.cart.length === 0) return;

    const payload = this.cart
        .map(ci => {
            const prod = this.productos.find(p => p.id === ci.producto_id);
            if (!prod) return null;

            return {
            producto_id: prod.id,
            cantidad: ci.cantidad,
            precio_unitario: prod.precio
            };
        })
        .filter(Boolean);


    await fetch(`https://cinerama-backen-react-native.onrender.com/api/reservas/${reservaId}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos: payload })
    });
  }


  // --- continuar ---
   async goPago(sinProductos) {
    if (!sinProductos) {
      await this.guardarProductosBD();
    } else {
      localStorage.removeItem("productos");
      localStorage.removeItem("productosResumen");
      localStorage.removeItem("totalProductos");
    }

    window.location.href = "pago.html";
  }

}

document.addEventListener("DOMContentLoaded", () => {
  const page = new ComidaPage();
  page.start();
});
