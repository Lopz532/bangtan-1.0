import { appUrl, auth, firebase, QUEEN_EMAIL } from './config.js';

// ==========================================
// CANVAS DE ESTRELLAS DE FONDO
// ==========================================
const canvas = document.getElementById("starsCanvas");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
}

class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.2 + 0.05;
        this.opacity = Math.random();
        this.opacityChange = Math.random() * 0.01 + 0.005;
    }
    update() {
        this.y -= this.speed;
        this.opacity += this.opacityChange;
        if (this.opacity > 1 || this.opacity < 0) {
            this.opacityChange = -this.opacityChange;
        }
        if (this.y < 0) {
            this.reset();
            this.y = canvas.height;
        }
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initStars() {
    stars = [];
    const starCount = Math.floor((canvas.width * canvas.height) / 8000);
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animate();


// ==========================================
// FORMULARIOS DE AUTENTICACIÓN
// ==========================================
const authScreen = document.getElementById("authScreen");
const magicTransition = document.getElementById("magicTransition");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const toRegister = document.getElementById("toRegister");
const toLogin = document.getElementById("toLogin");

toRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.remove("active-form");
    registerForm.classList.add("active-form");
});

toLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.classList.remove("active-form");
    loginForm.classList.add("active-form");
});

// Listener de cambios de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        handleAuthRedirect(user);
    }
});

// Redireccionar al usuario a la página correcta
function handleAuthRedirect(user) {
    if (user.email && user.email.toLowerCase() === QUEEN_EMAIL.toLowerCase()) {
        // Es tu novia! Mostrar disolución mágica y redireccionar
        triggerMagicTransition(appUrl("queen.html"));
    } else {
        // Es una ARMY común, redireccionar directo
        window.location.assign(appUrl("army.html"));
    }
}

// Transición mágica con overlay
function triggerMagicTransition(targetUrl) {
    magicTransition.classList.remove("hidden");
    magicTransition.style.opacity = "1";

    setTimeout(() => {
        window.location.assign(targetUrl);
    }, 2000);
}

// Registro por Correo/Contraseña
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value.trim();
    const pass = document.getElementById("registerPass").value;

    if (!email || !pass) return;

    if (email.toLowerCase() === QUEEN_EMAIL.toLowerCase()) {
        alert("Este correo electrónico está reservado. El administrador debe agregarlo manualmente.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, pass)
        .then(() => {
            alert("¡Cuenta ARMY creada con éxito! Iniciando sesión...");
            registerForm.reset();
        })
        .catch((error) => {
            console.error("Error en Registro:", error);
            alert("Error al registrar cuenta: " + error.message);
        });
});

// Login tradicional
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value;

    auth.signInWithEmailAndPassword(email, pass)
        .catch((error) => {
            console.error("Error en Login:", error);
            alert("Correo o contraseña incorrectos. " + error.message);
        });
});

// Login con Google
document.getElementById("btnGoogleLogin").addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .catch((error) => {
            console.error("Error en Google Login:", error);
            alert("Error al iniciar sesión con Google: " + error.message);
        });
});
