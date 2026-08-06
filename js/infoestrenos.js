class Slider {
    constructor(selector, interval = 3000) {
        this.slides = document.querySelectorAll(`${selector} .slide`);
        this.currentSlide = 0;
        this.interval = interval;
        this.start();
    }
 
    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
 
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }
 
    start() {
        this.showSlide(this.currentSlide);
        setInterval(() => this.nextSlide(), this.interval);
    }
}
 
// Inicialización
const slider = new Slider('.slider');
 
 
// Menú hamburguesa
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
 
 
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open'); // 🔥 Esto es lo que hace que el slider se mueva
});
 
class TrailerModal {
    constructor(modalSelector, videoSelector, closeSelector) {
        this.modal = document.querySelector(modalSelector);
        this.trailerVideo = document.querySelector(videoSelector);
        this.closeButton = document.querySelector(closeSelector);
 
        // Cerrar modal al hacer click en la X
        this.closeButton.addEventListener('click', () => this.closeModal());
 
        // Cerrar modal al hacer click fuera del contenido
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }
 
    openModal(videoUrl) {
        this.trailerVideo.src = videoUrl;
        this.modal.style.display = 'block';
    }
 
    closeModal() {
        this.modal.style.display = 'none';
        this.trailerVideo.src = ''; // Detener el video
    }
}
 
// Crear instancia del modal
const trailerModal = new TrailerModal('#trailerModal', '#trailerVideo', '.close');
 
// Asignar evento click a los botones
const trailerButtons = document.querySelectorAll('.btn-trailer');
 
trailerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const videoUrl = button.getAttribute('data-video');
        trailerModal.openModal(videoUrl);
    });
});
 
 
class InfoPelicula {
    constructor() {
        this.params = new URLSearchParams(window.location.search);
        this.pelicula = this.params.get('pelicula');
 
        // Referencias a los elementos
        this.titulo = document.querySelector('#titulo-pelicula');
        this.director = document.querySelector('#director');
        this.duracion = document.querySelector('#duracion');
        this.estreno = document.querySelector('#estreno');
        this.reparto = document.querySelector('#reparto');
        this.sinopsis = document.querySelector('#sinopsis');
        this.poster = document.querySelector('#poster-pelicula');
 
        this.categorias = {
            cat1: document.getElementById('categoria-1'),
            cat2: document.getElementById('categoria-2'),
            cat3: document.getElementById('categoria-3')
        };
 
        this.btnTrailer = document.querySelector('.btn-trailer'); // <--- el botón
 
        this.modal = document.querySelector('#trailerModal');
        this.trailerVideo = document.querySelector('#trailerVideo');
        this.closeButton = document.querySelector('.close');
 
        this.peliculasInfo = {
            residentEvil: {
                titulo: "Resident Evil",
                director: "Zach Cregger",
                duracion: "01:30:00",
                estreno: "2026-09-18",
                reparto: "Austin Abrams, Zach Cherry, Kali Reis, Paul Walter Hauser",
                sinopsis: "Bryan, un mensajero médico, queda atrapado en una aterradora noche de caos y debe luchar por sobrevivir mientras todo a su alrededor se descontrola.",
                poster: "imagenes/estrenos/resident_evil.jpg",
                categorias: ["TERROR", "ACCIÓN", "MAYORES DE 18"],
                trailer: ""
            },

            streetFighter: {
                titulo: "Street Fighter",
                director: "Kitao Sakurai",
                duracion: "",
                estreno: "2026-10-16",
                reparto: "Andrew Koji, Noah Centineo, Callina Liang",
                sinopsis: "Ryu y Ken regresan al combate cuando Chun-Li los recluta para participar en el World Warrior Tournament, donde descubrirán una peligrosa conspiración.",
                poster: "imagenes/estrenos/street_fighter.jpg",
                categorias: ["ACCIÓN", "AVENTURA", "MAYORES DE 14"],
                trailer: ""
            },

            hungerGames: {
                titulo: "The Hunger Games: Sunrise on the Reaping",
                director: "Francis Lawrence",
                duracion: "",
                estreno: "2026-11-20",
                reparto: "Joseph Zada, Ralph Fiennes, Elle Fanning, Jesse Plemons",
                sinopsis: "La historia regresa a Panem 24 años antes de los acontecimientos de Los Juegos del Hambre y sigue el inicio de los 50.º Juegos del Hambre, conocidos como el Segundo Vasallaje de los Veinticinco.",
                poster: "imagenes/estrenos/hunger_games.jpg",
                categorias: ["ACCIÓN", "AVENTURA", "MAYORES DE 14"],
                trailer: ""
            },

            avengersDoomsday: {
                titulo: "Avengers: Doomsday",
                director: "Anthony Russo, Joe Russo",
                duracion: "",
                estreno: "2026-12-18",
                reparto: "Robert Downey Jr., Chris Evans, Chris Hemsworth, Pedro Pascal, Anthony Mackie, Vanessa Kirby",
                sinopsis: "Héroes provenientes de distintos universos se enfrentarán a una amenaza existencial que los llevará a una peligrosa colisión entre mundos.",
                poster: "imagenes/estrenos/avengers_doomsday.jpg",
                categorias: ["ACCIÓN", "AVENTURA", "MAYORES DE 14"],
                trailer: ""
            }
        };
 
        this.cargarPelicula();
        this.configurarModal();
    }
 
    cargarPelicula() {
        if (this.peliculasInfo[this.pelicula]) {
            const data = this.peliculasInfo[this.pelicula];
 
            this.titulo.textContent = data.titulo;
            this.director.textContent = data.director;
            this.duracion.textContent = data.duracion;
            this.estreno.textContent = data.estreno;
            this.reparto.textContent = data.reparto;
            this.sinopsis.textContent = data.sinopsis;
            this.poster.src = data.poster;
 
            // Cargar etiquetas
            this.categorias.cat1.textContent = data.categorias[0];
            this.categorias.cat2.textContent = data.categorias[1];
            this.categorias.cat3.textContent = data.categorias[2];
 
            // Configurar botón trailer
            this.btnTrailer.addEventListener('click', () => {
                this.abrirModal(data.trailer);
            });
 
        } else {
            this.titulo.textContent = "Película no encontrada";
        }
    }
 
    configurarModal() {
        // Cerrar con la X
        this.closeButton.addEventListener('click', () => this.cerrarModal());
 
        // Cerrar al hacer click fuera del contenido
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.cerrarModal();
            }
        });
    }
 
    abrirModal(trailerUrl) {
        this.trailerVideo.src = trailerUrl;
        this.modal.style.display = 'flex';
    }
 
    cerrarModal() {
        this.modal.style.display = 'none';
        this.trailerVideo.src = '';
    }
}
 
// Inicializar la clase cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    new InfoPelicula();
});
 
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
 
    handleClick(event) {
        const button = event.currentTarget;
 
        const horarioSeleccionado = button.getAttribute('data-hora');
        localStorage.setItem('horarioSeleccionado', horarioSeleccionado);
 
        const tipoCine = button.getAttribute('data-cine');
        localStorage.setItem('tipoCine', tipoCine);
 
        const parametro = new URLSearchParams(window.location.search);
        const pelicula = parametro.get('pelicula');
 
        const dataCine = this.peliculasInfo[pelicula];
        localStorage.setItem('dataCine', JSON.stringify(dataCine));
 
        window.location.href = './asientos.html';
    }
 
    getPeliculasInfo() {
        return {
            residentEvil: {
                titulo: "Resident Evil",
                director: "Zach Cregger",
                duracion: "01:30:00",
                estreno: "2026-09-18",
                reparto: "Austin Abrams, Zach Cherry, Kali Reis, Paul Walter Hauser",
                sinopsis: "Bryan, un mensajero médico, queda atrapado en una aterradora noche de caos y debe luchar por sobrevivir mientras todo a su alrededor se descontrola.",
                poster: "imagenes/estrenos/resident_evil.jpg",
                categorias: ["TERROR", "ACCIÓN"],
                trailer: "",
                sala: "01"
            },

            streetFighter: {
                titulo: "Street Fighter",
                director: "Kitao Sakurai",
                duracion: "",
                estreno: "2026-10-16",
                reparto: "Andrew Koji, Noah Centineo, Callina Liang",
                sinopsis: "Ryu y Ken regresan al combate cuando Chun-Li los recluta para participar en el World Warrior Tournament, donde descubrirán una peligrosa conspiración.",
                poster: "imagenes/estrenos/street_fighter.jpg",
                categorias: ["ACCIÓN", "AVENTURA"],
                trailer: "",
                sala: "02"
            },

            hungerGames: {
                titulo: "The Hunger Games: Sunrise on the Reaping",
                director: "Francis Lawrence",
                duracion: "",
                estreno: "2026-11-20",
                reparto: "Joseph Zada, Ralph Fiennes, Elle Fanning, Jesse Plemons",
                sinopsis: "La historia regresa a Panem 24 años antes de los acontecimientos de Los Juegos del Hambre y sigue el inicio de los 50.º Juegos del Hambre, conocidos como el Segundo Vasallaje de los Veinticinco.",
                poster: "imagenes/estrenos/hunger_games.jpg",
                categorias: ["ACCIÓN", "AVENTURA"],
                trailer: "",
                sala: "03"
            },

            avengersDoomsday: {
                titulo: "Avengers: Doomsday",
                director: "Anthony Russo, Joe Russo",
                duracion: "",
                estreno: "2026-12-18",
                reparto: "Robert Downey Jr., Chris Evans, Chris Hemsworth, Pedro Pascal, Anthony Mackie, Vanessa Kirby",
                sinopsis: "Héroes provenientes de distintos universos se enfrentarán a una amenaza existencial que los llevará a una peligrosa colisión entre mundos.",
                poster: "imagenes/estrenos/avengers_doomsday.jpg",
                categorias: ["ACCIÓN", "AVENTURA", "CIENCIA FICCIÓN"],
                trailer: "",
                sala: "04"
            }
        };
    }
}
 
// Inicialización
const btnHoraHandler = new BtnHoraHandler('.btn-hora');