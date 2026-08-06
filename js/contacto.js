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

class ContactFormHandler {
    constructor(formId, messageId) {
        this.contactForm = document.getElementById(formId);
        this.formMessage = document.getElementById(messageId);

        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const email = document.getElementById('email').value.trim();
        const asunto = document.getElementById('asunto').value.trim();
        const cine = document.getElementById('cine').value;
        const mensaje = document.getElementById('mensaje').value.trim();

        // Validación de campos vacíos
        if (nombre === '' || apellidos === '' || email === '' || asunto === '' || cine === '' || mensaje === '') {
            this.showMessage('Por favor, completa todos los campos.', 'red');
            return;
        }

        // Validación de nombre, apellidos y asunto → solo letras
        const soloLetrasRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;

        if (!soloLetrasRegex.test(nombre)) {
            this.showMessage('El campo "Nombre" solo debe contener letras.', 'red');
            return;
        }

        if (!soloLetrasRegex.test(apellidos)) {
            this.showMessage('El campo "Apellidos" solo debe contener letras.', 'red');
            return;
        }

        if (!soloLetrasRegex.test(asunto)) {
            this.showMessage('El campo "Asunto" solo debe contener letras.', 'red');
            return;
        }

        // Validación del MENSAJE → debe contener al menos UNA letra
        const contieneLetraRegex = /[a-zA-ZÁÉÍÓÚáéíóúÑñ]/;

        if (!contieneLetraRegex.test(mensaje)) {
            this.showMessage('El campo "Mensaje" debe contener al menos una letra. No puede ser solo números o símbolos.', 'red');
            return;
        }

        // Guardar en localStorage para el panel de administración
        const mensajeObj = {
            nombre,
            apellidos,
            email,
            asunto,
            cine,
            mensaje,
            fecha: new Date().toLocaleString()
        };
        await fetch("https://cinerama-backen-react-native.onrender.com/api/contacto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre,
                apellidos,
                email,
                asunto,
                cine,
                mensaje
            })
        });


        // Feedback al usuario
        const textoMensaje = '¡Tus datos han sido enviados correctamente!';
        this.showToast(`${textoMensaje} 🎉`, '#28a745');  // color verde
        const audio = document.getElementById('audio-enviado');
        audio.play();
        this.contactForm.reset();

        // Limpia el mensaje después de 3 segundos
        setTimeout(() => {
            this.formMessage.textContent = '';
        }, 3000);
    }

    showToast(message, color) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.backgroundColor = color;
        toast.className = 'toast show';

        // Oculta el toast después de 5 segundos
        setTimeout(() => {
            toast.className = 'toast';
        }, 5000);
    }

    reproducirMensaje(texto) {
        const mensaje = new SpeechSynthesisUtterance(texto);
        mensaje.lang = 'es-ES';
        mensaje.rate = 1;
        window.speechSynthesis.speak(mensaje);
    }

    showMessage(message, color) {
        this.formMessage.style.color = color;
        this.formMessage.textContent = message;
    }
}

// Inicializar la clase
const contactFormHandler = new ContactFormHandler('contactForm', 'formMessage');



