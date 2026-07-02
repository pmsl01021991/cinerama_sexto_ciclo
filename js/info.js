// ===============================
// CARGAR FICHA DE LA PELÍCULA
// ===============================
const params = new URLSearchParams(window.location.search);
const codigo = params.get("pelicula");

const infoPeliculas = {
    chavin: {
        titulo: "EL AFINADOR",
        director: "DANIEL ROHER.",
        duracion: "01:47:00 min",
        estreno: "2026-06-25",
        reparto: "LEO WOODALL, DUSTIN HOFFMAN, ALISEN RICHMOND-PECK.",
        sinopsis: "HARRY HOROWITZ ES UN VETERANO AFINADOR DE PIANOS QUE TRABAJA JUNTO A NIKI, SU LEAL Y TALENTOSO APRENDIZ, QUE PADECE HIPERACUSIA, UNA RARA CONDICIÓN QUE LE PROVOCA PERCIBIR LOS SONIDOS A UN VOLUMEN EXAGERADAMENTE ALTO, LO QUE LE OBLIGA A USAR TAPONES PARA LOS OÍDOS CONSTANTEMENTE. CUANDO EL JOVEN DESCUBRE UNA APTITUD INESPERADA PARA ABRIR CAJAS FUERTES, SE VERÁ INVOLUCRADO EN EL PELIGROSO MUNDO DEL CRIMEN Y SU TRANQUILA VIDA CAMBIARÁ POR COMPLETO.",
        poster: "imagenes/el_afinador.jpg",
        categorias: ["MAYORES DE 14", "ANIMADO", "BF"],
        trailer: "https://www.youtube.com/embed/Lmu8z-JTMcQ"
    },
    hurry: {
        titulo: "SUPER GIRL",
        director: "CRAIG GILLESPIE.",
        duracion: "01:48:00 min",
        estreno: "2026-06-24",
        reparto: "MILLY ALCOCK, DAVID CORENSWET, EVE RIDLEY.",
        sinopsis: "KARA, LA PRIMA DE SUPERMAN, SE HA IDO HACIENDO MÁS FUERTE CON EL PASO DE LOS AÑOS Y TAMBIÉN DEBIDO A LA CAÍDA DE KRYPTON. MIENTRAS VA VIAJANDO POR DIFERENTES LUGARES, CONOCE A RUTHYE, UNA JOVEN QUE BUSCA VENGANZA POR EL ASESINATO DE SU PADRE.",
        poster: "imagenes/super_girl.jpg",
        categorias: ["TODO ESPECTADOR", "AVENTURA", "FAMILIAR"],
        trailer: "https://www.youtube.com/embed/S2JsnctozH4"
    },
    zootopia2: {
        titulo: "TOY STORY",
        director: "MCKENNA HARRIS, ANDREW STANTON.",
        duracion: "01:42:00 min",
        estreno: "2026-06-17",
        reparto: "TOM HANKS, KEANU REEVES, JOAN CUSACK.",
        sinopsis: "LOS JUGUETES ESTÁN DE VUELTA. ESTA VEZ, BUZZ LIGHTYEAR, WOODY, JESSIE Y EL RESTO DE LA PANDILLA SE ENFRENTAN A UN NUEVO RETO CUANDO CONOCEN A LILYPAD, UNA NUEVA TABLET QUE LLEGA CON SUS PROPIAS IDEAS DISRUPTIVAS SOBRE LO QUE ES MEJOR PARA BONNIE. ¿VOLVERÁ A SER LO MISMO LA HORA DE JUGAR?",
        poster: "imagenes/toy_story.webp",
        categorias: ["TODO ESPECTADOR", "ANIMACION", "CINECOLOR"],
        trailer: "https://www.youtube.com/embed/s_qpMMkvHYE"
    },
    nada3: {
        titulo: "EL DIA DE LA REVELACION",
        director: "STEVEN SPIELBERG",
        duracion: "02:25:00 min",
        estreno: "2026-06-10",
        reparto: "EMILY BLUNT, JOSH O'CONNOR, COLIN FIRTH.",
        sinopsis: "EN UN FUTURO NO MUY LEJANO, LA HUMANIDAD ESTÁ A PUNTO DE DESCRIBIR LA VERDAD SOBRE LA EXISTENCIA DE EXTRATERRESTRES, UN SECRETO QUE HA PERMANECIDO OCULTO DURANTE VARIAS DÉCADAS. MIENTRAS MILLONES DE PERSONAS SE PREPARAN PARA RECIBIR LA REVELACIÓN, ALGUNAS VIEJAS CREENCIAS SE VEN CUESTIONADAS, Y LA FORMA EN LA QUE ENTENDEMOS EL UNIVERSO EMPIEZA A CAMBIAR. ENTRE CONSPIRACIONES, AVANCES DE LA TECNOLOGÍA Y ENCUENTROS INESPERADOS, LA REVELACIÓN PROMETE CAMBIAR VIDAS, RELACIONES Y LA PROPIA PERCEPCIÓN DE NUESTRO LUGAR EN EL UNIVERSO PARA SIEMPRE.",
        poster: "imagenes/el_dia_de_la_revelacion.webp",
        categorias: ["MAYORES DE 14", "ACCION", "BF"],
        trailer: "https://www.youtube.com/embed/-XXZgYygh40"
    }
};

const data = infoPeliculas[codigo];

// Cargar datos a la página
if(data){
    document.getElementById("poster-pelicula").src = data.poster;
    document.getElementById("titulo-pelicula").textContent = data.titulo;

    document.getElementById("director").textContent = data.director;
    document.getElementById("duracion").textContent = data.duracion;
    document.getElementById("estreno").textContent = data.estreno;
    document.getElementById("reparto").textContent = data.reparto;
    document.getElementById("sinopsis").textContent = data.sinopsis;

    // Categorías
    document.getElementById("categoria-1").textContent = data.categorias[0] || "";
    document.getElementById("categoria-2").textContent = data.categorias[1] || "";
    document.getElementById("categoria-3").textContent = data.categorias[2] || "";

    // Trailer
    const btn = document.getElementById("btnTrailer");
    btn.onclick = () => {
        document.getElementById("trailerVideo").src = data.trailer;
        document.getElementById("trailerModal").style.display = "flex";
    };
}


class BtnHoraHandler {
    constructor(selector) {
        this.buttons = document.querySelectorAll(selector);
        this.peliculasInfo = this.getPeliculasInfo();
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (event) => this.handleClick(event));
        });
    }

    async handleClick(event) {
        const button = event.currentTarget;

        // Hora y tipo de sala (2D / 3D)
        const horarioSeleccionado = button.getAttribute('data-hora');
        const tipoCine = button.getAttribute('data-cine');   // ← OJO: nombre coherente

        // Código de la película que viene en la URL: ?pelicula=hurry
        const parametro = new URLSearchParams(window.location.search);
        const codigoPelicula = parametro.get('pelicula');    // ej: "hurry"

        const data = this.peliculasInfo[codigoPelicula];
        if (!data) {
            alert("Película no encontrada");
            return;
        }

        // id de la reserva creada en index (cuando eliges el cine)
        const reservaId = localStorage.getItem("reservaId");
        if (!reservaId) {
            alert("Selecciona primero un cine.");
            window.location.href = "index.html#cines";
            return;
        }

        // Guardamos info para la pantalla de asientos
        localStorage.setItem("dataCine", JSON.stringify(data));
        localStorage.setItem("horarioSeleccionado", horarioSeleccionado);
        localStorage.setItem("tipoCine", tipoCine); // ← la misma key que lees en asientos.js

        // Datos que van a la BD
        const peliculaCodigo = codigoPelicula;   // ej: "hurry"
        const peliculaTitulo = data.titulo;      // ej: "Hurry"

        try {
            const resp = await fetch(`http://localhost:3001/api/reservas/${reservaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pelicula_codigo: peliculaCodigo,
                    pelicula_titulo: peliculaTitulo,
                    tipo_cine: tipoCine,                 // '2D' o '3D'
                    sala: data.sala,                     // '01', '02', etc.
                    horario: horarioSeleccionado         // '04:00 pm'
                })
            });

            if (!resp.ok) throw new Error("Error al actualizar película");

            console.log("Reserva actualizada con película y horario");
            window.location.href = "./asientos.html";
        } catch (err) {
            console.error(err);
            alert("No se pudo actualizar la reserva.");
        }
    }

    getPeliculasInfo() {
        return {
            chavin: {
                titulo: "EL AFINADOR",
                director: "DANIEL ROHER.",
                duracion: "01:47:00",
                estreno: "2026-06-25",
                reparto: "LEO WOODALL, DUSTIN HOFFMAN, ALISEN RICHMOND-PECK.",
                sinopsis: "HARRY HOROWITZ ES UN VETERANO AFINADOR DE PIANOS QUE TRABAJA JUNTO A NIKI, SU LEAL Y TALENTOSO APRENDIZ, QUE PADECE HIPERACUSIA, UNA RARA CONDICIÓN QUE LE PROVOCA PERCIBIR LOS SONIDOS A UN VOLUMEN EXAGERADAMENTE ALTO, LO QUE LE OBLIGA A USAR TAPONES PARA LOS OÍDOS CONSTANTEMENTE. CUANDO EL JOVEN DESCUBRE UNA APTITUD INESPERADA PARA ABRIR CAJAS FUERTES, SE VERÁ INVOLUCRADO EN EL PELIGROSO MUNDO DEL CRIMEN Y SU TRANQUILA VIDA CAMBIARÁ POR COMPLETO.",
                poster: "imagenes/el_afinador.jpg",
                categorias: ["MAYORES DE 14", "ANIMADO", "BF"],
                trailer: "https://www.youtube.com/embed/Lmu8z-JTMcQ",
                sala: "01",
                url: "info.html?pelicula=chavin"
            },
            hurry: {
                titulo: "Hurry",
                director: "DIRECTOR X",
                duracion: "01:40:00",
                estreno: "2025-08-01",
                reparto: "Actores y actrices reconocidos",
                sinopsis: "Una emocionante carrera contra el tiempo.",
                poster: "imagenes/hurry.jpg",
                categorias: ["TODO ESPECTADOR", "AVENTURA", "FAMILIAR"],
                trailer: "https://www.youtube.com/embed/s_qpMMkvHYE",
                sala: "02",
                url: "info.html?pelicula=hurry"
            },
            zootopia2: {
                titulo: "ZOOTOPIA 2",
                director: "JARED BUSH, BYRON HOWARD",
                duracion: "01:48:00",
                estreno: "2025-11-27",
                reparto: "-",
                sinopsis: "La policía coneja Judy Hopps y su amigo el zorro Nick Wilde vuelven a unirse para resolver su caso más peligroso y complejo.",
                poster: "imagenes/estrenos/zootopia2.jpg",
                categorias: ["TODO ESPECTADOR", "ANIMACION", "CINECOLOR"],
                trailer: "https://www.youtube.com/embed/A-7RMaQaygI",
                sala: "03",
                url: "info.html?pelicula=zootopia2"
            },
            nada3: {
                titulo: "NADA ES LO QUE PARECE 3",
                director: "RUBEN FLEISCHER",
                duracion: "01:52:00",
                estreno: "2025-11-13",
                reparto: "MORGAN FREEMAN, ROSAMUND PIKE, WOODY HARRELSON",
                sinopsis: "Los cuatro jinetes vuelven con más giros, trampas y espectáculo que nunca.",
                poster: "imagenes/estrenos/NADAESLOQUEPARECE.jpg",
                categorias: ["MAYORES DE 14", "ACCION", "BF"],
                trailer: "https://www.youtube.com/embed/-XXZgYygh40",
                sala: "04",
                url: "info.html?pelicula=nada3"
            }
        };
    }
}

// Inicialización
const btnHoraHandler = new BtnHoraHandler('.btn-hora');

// ===============================
// FILTRAR HORARIOS (SOLO 1 POR 2D / 3D)
// ===============================
class HorarioFiltro {
    constructor(selector) {
        this.botones = document.querySelectorAll(selector);
        this.visto = {
            "2D": false,
            "3D": false
        };
        this.filtrar();
    }

    filtrar() {
        this.botones.forEach(btn => {
            const tipo = btn.getAttribute("data-cine");

            if (!this.visto[tipo]) {
                // primer horario encontrado → se queda
                this.visto[tipo] = true;
            } else {
                // los demás se ocultan
                btn.style.display = "none";
            }
        });
    }
}

// Inicialización (NO afecta a tu lógica existente)
document.addEventListener("DOMContentLoaded", () => {
    new HorarioFiltro(".btn-hora");
});

