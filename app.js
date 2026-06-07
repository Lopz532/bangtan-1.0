// ==========================================
// CONFIGURACIÓN DE FIREBASE (PRODUCCIÓN)
// ==========================================
// Rellena estos datos con las credenciales de tu consola de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDao8ocv_42bU4-jMAbd_q445Co9nLcOho",
    authDomain: "bangtan-love-space.firebaseapp.com",
    projectId: "bangtan-love-space",
    storageBucket: "bangtan-love-space.firebasestorage.app",
    messagingSenderId: "965693355311",
    appId: "1:965693355311:web:458351ac5695a68b939dda"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Habilitar persistencia de datos local para Firestore en offline (opcional y recomendado)
db.enablePersistence().catch((err) => {
    console.warn("La persistencia de Firestore no está disponible:", err.code);
});

// ==========================================
// CONFIGURACIÓN Y ESTADO GLOBAL DE LA APP
// ==========================================
// CAMBIA ESTO POR EL CORREO REAL DE TU NOVIA CUANDO LO TENGAS
const QUEEN_EMAIL = "jorgelopz532@gmail.com";
const ANNIVERSARY_DATE = new Date("2025-12-13T00:00:00");

// Canciones y Dedicatorias del Panel Especial (GF)
const specialPlaylist = [
    {
        title: "Still With You",
        artist: "Jungkook",
        file: "still_with_you",
        dedication: "Esta canción de Jungkook me hace pensar en ti siempre... En los días de lluvia y en los días soleados, mi deseo es estar 'Aún contigo' en cada paso que demos. Eres mi refugio seguro. 💜"
    },
    {
        title: "Euphoria",
        artist: "Jungkook",
        file: "euphoria",
        dedication: "Eres mi euforia, Valentina, la persona que hace que mi mundo brille de una forma especial. Escuchar esta canción es escuchar lo que siento cuando te veo sonreír. ¡Eres la causa de mi euforia! 👑"
    },
    {
        title: "Spring Day",
        artist: "BTS",
        file: "spring_day",
        dedication: "Aunque pasen los días fríos o la distancia nos separe por momentos, siempre te esperaré y te buscaré. Eres mi primavera eterna, mi día soleado favorito. 🌸"
    },
    {
        title: "Seven",
        artist: "Jungkook",
        file: "seven",
        dedication: "Te amo los 7 días de la semana, cada hora, cada minuto, cada segundo. Eres mi pensamiento constante de lunes a domingo. Jorge te adora. 🐰✨"
    }
];

// Canciones del Panel General (ARMY)
const generalPlaylist = [
    { title: "Dynamite", artist: "BTS" },
    { title: "Butter", artist: "BTS" },
    { title: "Boy With Luv", artist: "BTS feat. Halsey" },
    { title: "Spring Day", artist: "BTS" },
    { title: "Fake Love", artist: "BTS" }
];

let currentSpecialTrackIndex = 0;
let currentGeneralTrackIndex = 0;
let isSpecialPlaying = false;
let isGeneralPlaying = false;
let specialPlayInterval = null;
let generalPlayInterval = null;
let specialProgressVal = 0;
let generalProgressVal = 0;

// Preguntas del Quiz de BTS
const quizQuestions = [
    {
        question: "¿Cuál sería tu cita ideal perfecta?",
        options: [
            { text: "Pasear junto al río Han de noche escuchando música", member: "RM" },
            { text: "Cocinar juntos y cenar entre risas", member: "Jin" },
            { text: "Quedarse en casa escribiendo canciones o viendo películas", member: "Suga" },
            { text: "Ir a un parque de atracciones o bailar juntos", member: "J-Hope" },
            { text: "Caminar por la playa agarrados de la mano", member: "Jimin" },
            { text: "Visitar una galería de arte o tomar fotos vintage", member: "V" },
            { text: "Hacer ejercicio, jugar videojuegos o cantar juntos", member: "Jungkook" }
        ]
    },
    {
        question: "¿Qué cualidad valoras más en tu pareja?",
        options: [
            { text: "La inteligencia y madurez", member: "RM" },
            { text: "El sentido del humor y que sepa cocinar", member: "Jin" },
            { text: "La tranquilidad y la sinceridad", member: "Suga" },
            { text: "La alegría y que siempre me haga sonreír", member: "J-Hope" },
            { text: "La ternura y la capacidad de escuchar", member: "Jimin" },
            { text: "La creatividad y el estilo único", member: "V" },
            { text: "La pasión y la lealtad absoluta", member: "Jungkook" }
        ]
    },
    {
        question: "Si tuvieras un día libre, ¿qué harías?",
        options: [
            { text: "Leer un libro en un parque tranquilo", member: "RM" },
            { text: "Pescar o disfrutar de comida deliciosa", member: "Jin" },
            { text: "Dormir o trabajar en mi hobby creativo", member: "Suga" },
            { text: "Hacer planes con amigos o salir de compras", member: "J-Hope" },
            { text: "Relajarme en casa charlando con alguien especial", member: "Jimin" },
            { text: "Explorar la ciudad y tomar fotos hermosas", member: "V" },
            { text: "Hacer deportes extremos o cantar karaoke", member: "Jungkook" }
        ]
    },
    {
        question: "Elige tu accesorio favorito:",
        options: [
            { text: "Libros o lentes de lectura", member: "RM" },
            { text: "Utensilios de cocina bonitos", member: "Jin" },
            { text: "Un teclado musical o audífonos grandes", member: "Suga" },
            { text: "Zapatos llamativos o sombreros con estilo", member: "J-Hope" },
            { text: "Anillos y collares delicados", member: "Jimin" },
            { text: "Cámara de fotos o abrigos elegantes", member: "V" },
            { text: "Gorras o pulseras deportivas", member: "Jungkook" }
        ]
    },
    {
        question: "¿Qué tipo de canción prefieres escuchar?",
        options: [
            { text: "Rap con letras profundas y filosóficas", member: "RM" },
            { text: "Baladas pop muy vocales y dulces", member: "Jin" },
            { text: "Hip-Hop alternativo con toques de piano", member: "Suga" },
            { text: "Música enérgica que te haga bailar", member: "J-Hope" },
            { text: "R&B suave y sentimental", member: "Jimin" },
            { text: "Jazz clásico o Neo-Soul acogedor", member: "V" },
            { text: "Pop moderno con ritmos potentes", member: "Jungkook" }
        ]
    }
];

let quizCurrentQuestion = 0;
let quizScores = {};
let currentTheme = "normal";


// ==========================================
// CANVAS DE ESTRELLAS DE FONDO
// ==========================================
const canvas = document.getElementById("starsCanvas");
const ctx = canvas.getContext("2d");
let stars = [];
let floatingHearts = [];

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

class HeartParticle {
    constructor(x, y, speedY, size, color) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || canvas.height + 20;
        this.size = size || Math.random() * 15 + 5;
        this.speedY = speedY || Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.opacity = 1;
        this.color = color || (Math.random() > 0.5 ? "rgba(255, 107, 181, 0.6)" : "rgba(160, 78, 252, 0.6)");
    }
    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.opacity -= 0.005;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.size / 4);
        ctx.quadraticCurveTo(this.x, this.y, this.x + this.size / 2, this.y);
        ctx.quadraticCurveTo(this.x + this.size, this.y, this.x + this.size, this.y + this.size / 3);
        ctx.quadraticCurveTo(this.x + this.size, this.y + (this.size * 2) / 3, this.x + this.size / 2, this.y + this.size);
        ctx.quadraticCurveTo(this.x, this.y + (this.size * 2) / 3, this.x, this.y + this.size / 3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
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

    if (currentTheme === "special") {
        if (Math.random() < 0.04 && floatingHearts.length < 50) {
            floatingHearts.push(new HeartParticle());
        }
    }

    floatingHearts.forEach((heart, index) => {
        heart.update();
        heart.draw();
        if (heart.opacity <= 0 || heart.y < -30) {
            floatingHearts.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animate();


// ==========================================
// AUTENTICACIÓN REAL CON FIREBASE
// ==========================================
const authScreen = document.getElementById("authScreen");
const armyScreen = document.getElementById("armyScreen");
const specialScreen = document.getElementById("specialScreen");
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

// Listener de cambio de estado de Autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        handleAuthSuccess(user);
    } else {
        // No está logueado, mostrar login
        authScreen.classList.remove("inactive-screen");
        authScreen.classList.add("active-screen");
        armyScreen.classList.remove("active-screen");
        armyScreen.classList.add("inactive-screen");
        specialScreen.classList.remove("active-screen");
        specialScreen.classList.add("inactive-screen");
        currentTheme = "normal";
        floatingHearts = [];
    }
});

// Procesar éxito de autenticación
function handleAuthSuccess(user) {
    if (user.email && user.email.toLowerCase() === QUEEN_EMAIL.toLowerCase()) {
        // Es tu novia! Acceso especial
        document.getElementById("gfWelcomeText").textContent = `✨ Bienvenida, ${user.displayName || 'Valentina'} ✨`;
        triggerMagicTransition();
    } else {
        // Es una ARMY común
        showArmyScreen(user);
    }
}

// Registro de Usuario (Email/Contraseña)
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value.trim();
    const pass = document.getElementById("registerPass").value;

    if (!email || !pass) return;

    if (email.toLowerCase() === QUEEN_EMAIL.toLowerCase()) {
        alert("Este correo electrónico está reservado para el portal especial. El administrador debe registrar este correo manualmente.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, pass)
        .then(() => {
            alert("¡Cuenta ARMY creada exitosamente! Iniciando sesión automáticamente...");
            registerForm.reset();
        })
        .catch((error) => {
            console.error("Error en Registro:", error);
            alert("No se pudo registrar la cuenta: " + error.message);
        });
});

// Inicio de Sesión Clásico (Email/Contraseña)
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

// Inicio de Sesión con Google
document.getElementById("btnGoogleLogin").addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .catch((error) => {
            console.error("Error en Google Login:", error);
            alert("Error al iniciar sesión con Google: " + error.message);
        });
});

// Transición mágica al portal especial
function triggerMagicTransition() {
    // Si ya está en pantalla especial, no repetir la animación
    if (specialScreen.classList.contains("active-screen")) return;

    magicTransition.classList.remove("hidden");
    magicTransition.style.opacity = "1";
    currentTheme = "special";

    setTimeout(() => {
        authScreen.classList.remove("active-screen");
        authScreen.classList.add("inactive-screen");
        armyScreen.classList.remove("active-screen");
        armyScreen.classList.add("inactive-screen");

        specialScreen.classList.remove("inactive-screen");
        specialScreen.classList.add("active-screen");

        startAnniversaryCounter();
        loadSpecialPlayerTrack(0);

        setTimeout(() => {
            magicTransition.style.opacity = "0";
            setTimeout(() => {
                magicTransition.classList.add("hidden");
            }, 800);
        }, 1200);
    }, 2000);
}

// Mostrar portal general de ARMY
function showArmyScreen(user) {
    if (armyScreen.classList.contains("active-screen")) return;

    authScreen.classList.remove("active-screen");
    authScreen.classList.add("inactive-screen");
    specialScreen.classList.remove("active-screen");
    specialScreen.classList.add("inactive-screen");

    armyScreen.classList.remove("inactive-screen");
    armyScreen.classList.add("active-screen");

    // Mostrar nombre bonito o correo
    const dispName = user.displayName || user.email.split('@')[0];
    document.getElementById("armyUserName").textContent = dispName;
    currentTheme = "normal";

    loadGeneralPlayerTrack(0);
    loadHeartWall();
}

// Cerrar sesión
function logout() {
    // Parar temporizadores de música simulada
    pauseGeneralPlayer();
    pauseSpecialPlayer();

    // Desvincular oyente del Muro de Corazones en tiempo real
    if (window.heartWallUnsubscribe) {
        window.heartWallUnsubscribe();
        window.heartWallUnsubscribe = null;
    }

    // Salir con Firebase
    auth.signOut().catch((error) => {
        console.error("Error al salir:", error);
    });
}


// ==========================================
// CONTADOR DE ANIVERSARIO
// ==========================================
let anniversaryInterval = null;

function startAnniversaryCounter() {
    if (anniversaryInterval) clearInterval(anniversaryInterval);

    function updateCounter() {
        const now = new Date();
        const diffMs = now - ANNIVERSARY_DATE;

        if (diffMs < 0) {
            document.getElementById("countDays").textContent = "00";
            document.getElementById("countHours").textContent = "00";
            document.getElementById("countMins").textContent = "00";
            document.getElementById("countSecs").textContent = "00";
            return;
        }

        const diffSecs = Math.floor(diffMs / 1000);
        const days = Math.floor(diffSecs / 86400);
        const hours = Math.floor((diffSecs % 86400) / 3600);
        const mins = Math.floor((diffSecs % 3600) / 60);
        const secs = diffSecs % 60;

        document.getElementById("countDays").textContent = String(days).padStart(2, '0');
        document.getElementById("countHours").textContent = String(hours).padStart(2, '0');
        document.getElementById("countMins").textContent = String(mins).padStart(2, '0');
        document.getElementById("countSecs").textContent = String(secs).padStart(2, '0');
    }

    updateCounter();
    anniversaryInterval = setInterval(updateCounter, 1000);
}


// ==========================================
// REPRODUCTOR GENERAL (ARMY)
// ==========================================
const generalVinyl = document.getElementById("generalVinyl");
const generalArm = document.getElementById("generalArm");
const generalPlayBtn = document.getElementById("generalPlayBtn");
const generalTrackTitle = document.getElementById("generalTrackTitle");
const generalTrackArtist = document.getElementById("generalTrackArtist");
const generalProgress = document.getElementById("generalProgress");

function loadGeneralPlayerTrack(index) {
    currentGeneralTrackIndex = index;
    const track = generalPlaylist[index];
    generalTrackTitle.textContent = track.title;
    generalTrackArtist.textContent = track.artist;
    generalProgress.style.width = "0%";
    generalProgressVal = 0;

    if (isGeneralPlaying) {
        playGeneralPlayer();
    }
}

function playGeneralPlayer() {
    isGeneralPlaying = true;
    generalVinyl.classList.add("playing");
    generalArm.classList.add("playing");
    generalPlayBtn.textContent = "⏸️";

    if (generalPlayInterval) clearInterval(generalPlayInterval);
    generalPlayInterval = setInterval(() => {
        generalProgressVal += 0.5;
        if (generalProgressVal >= 100) {
            generalProgressVal = 0;
            nextGeneralTrack();
        }
        generalProgress.style.width = `${generalProgressVal}%`;
    }, 1000);
}

function pauseGeneralPlayer() {
    isGeneralPlaying = false;
    generalVinyl.classList.remove("playing");
    generalArm.classList.remove("playing");
    generalPlayBtn.textContent = "▶️";
    if (generalPlayInterval) clearInterval(generalPlayInterval);
}

function nextGeneralTrack() {
    let index = currentGeneralTrackIndex + 1;
    if (index >= generalPlaylist.length) index = 0;
    loadGeneralPlayerTrack(index);
}

function prevGeneralTrack() {
    let index = currentGeneralTrackIndex - 1;
    if (index < 0) index = generalPlaylist.length - 1;
    loadGeneralPlayerTrack(index);
}

generalPlayBtn.addEventListener("click", () => {
    if (isGeneralPlaying) {
        pauseGeneralPlayer();
    } else {
        playGeneralPlayer();
    }
});

document.getElementById("generalNextBtn").addEventListener("click", nextGeneralTrack);
document.getElementById("generalPrevBtn").addEventListener("click", prevGeneralTrack);


// ==========================================
// REPRODUCTOR ESPECIAL (ARMY QUEEN)
// ==========================================
const specialVinyl = document.getElementById("specialVinyl");
const specialArm = document.getElementById("specialArm");
const specialPlayBtn = document.getElementById("specialPlayBtn");
const specialTrackTitle = document.getElementById("specialTrackTitle");
const specialTrackArtist = document.getElementById("specialTrackArtist");
const specialProgress = document.getElementById("specialProgress");
const specialDedicationText = document.getElementById("specialDedicationText");

function loadSpecialPlayerTrack(index) {
    currentSpecialTrackIndex = index;
    const track = specialPlaylist[index];
    specialTrackTitle.textContent = track.title;
    specialTrackArtist.textContent = `${track.artist} (Dedicado por Jorge)`;
    specialDedicationText.textContent = track.dedication;
    specialProgress.style.width = "0%";
    specialProgressVal = 0;

    if (isSpecialPlaying) {
        playSpecialPlayer();
    }
}

function playSpecialPlayer() {
    isSpecialPlaying = true;
    specialVinyl.classList.add("playing");
    specialArm.classList.add("playing");
    specialPlayBtn.textContent = "⏸️";

    if (specialPlayInterval) clearInterval(specialPlayInterval);
    specialPlayInterval = setInterval(() => {
        specialProgressVal += 0.4;
        if (specialProgressVal >= 100) {
            specialProgressVal = 0;
            nextSpecialTrack();
        }
        specialProgress.style.width = `${specialProgressVal}%`;
    }, 1000);
}

function pauseSpecialPlayer() {
    isSpecialPlaying = false;
    specialVinyl.classList.remove("playing");
    specialArm.classList.remove("playing");
    specialPlayBtn.textContent = "▶️";
    if (specialPlayInterval) clearInterval(specialPlayInterval);
}

function nextSpecialTrack() {
    let index = currentSpecialTrackIndex + 1;
    if (index >= specialPlaylist.length) index = 0;
    loadSpecialPlayerTrack(index);
}

function prevSpecialTrack() {
    let index = currentSpecialTrackIndex - 1;
    if (index < 0) index = specialPlaylist.length - 1;
    loadSpecialPlayerTrack(index);
}

specialPlayBtn.addEventListener("click", () => {
    if (isSpecialPlaying) {
        pauseSpecialPlayer();
    } else {
        playSpecialPlayer();
    }
});

document.getElementById("specialNextBtn").addEventListener("click", nextSpecialTrack);
document.getElementById("specialPrevBtn").addEventListener("click", prevSpecialTrack);


// ==========================================
// MURO DE CORAZONES EN TIEMPO REAL CON FIRESTORE
// ==========================================
const heartWall = document.getElementById("heartWall");
const heartForm = document.getElementById("heartForm");
const heartMessage = document.getElementById("heartMessage");
let selectedColor = "purple";

// Cambiar color seleccionado
const colorDots = document.querySelectorAll(".color-dot");
colorDots.forEach(dot => {
    dot.addEventListener("click", () => {
        colorDots.forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
        selectedColor = dot.getAttribute("data-color");
    });
});

function loadHeartWall() {
    // Si ya hay una suscripción activa, desvincularla para no duplicar listeners
    if (window.heartWallUnsubscribe) {
        window.heartWallUnsubscribe();
    }

    // Escuchar cambios en Firestore en tiempo real (últimos 30 mensajes)
    window.heartWallUnsubscribe = db.collection("heart_messages")
        .orderBy("timestamp", "asc")
        .limitToLast(30)
        .onSnapshot((snapshot) => {
            heartWall.innerHTML = "";
            snapshot.forEach((doc) => {
                const msg = doc.data();
                const heartEl = document.createElement("div");
                heartEl.className = `glowing-heart-msg theme-${msg.color || 'purple'}`;
                heartEl.innerHTML = `<span>💜</span> ${escapeHTML(msg.message)}`;
                heartWall.appendChild(heartEl);
            });

            // Desplazar contenedor al final
            const container = document.querySelector(".heart-wall-container");
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, (error) => {
            console.error("Error al escuchar cambios en el muro de corazones:", error);
        });
}

// Guardar corazón en Firestore
heartForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msgText = heartMessage.value.trim();
    if (!msgText) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
        alert("Debes iniciar sesión para escribir en el muro.");
        return;
    }

    db.collection("heart_messages").add({
        message: msgText,
        color: selectedColor,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email
    })
        .then(() => {
            heartMessage.value = "";
        })
        .catch((error) => {
            console.error("Error al subir mensaje:", error);
            alert("Error al enviar el corazón al muro en la nube: " + error.message);
        });
});

function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}


// ==========================================
// QUIZ: TU ALMA GEMELA DE BTS (ARMY SCREEN)
// ==========================================
const quizStartScreen = document.getElementById("quizStartScreen");
const quizQuestionBox = document.getElementById("quizQuestionBox");
const quizResultBox = document.getElementById("quizResultBox");
const quizQuestionText = document.getElementById("quizQuestionText");
const quizOptionsContainer = document.getElementById("quizOptionsContainer");
const currentQuestionNum = document.getElementById("currentQuestionNum");

const memberProfiles = {
    "RM": { desc: "Tu alma gemela es RM (Namjoon). Eres compatible con él por tu amor por las conversaciones profundas, el arte y los libros. Te encantará compartir tés calientes y caminatas por museos.", icon: "🐨" },
    "Jin": { desc: "Tu alma gemela es Jin. Adoras las risas sinceras, la comida reconfortante y la gente con buena vibra que no teme verse divertida. Tus días con él estarán llenos de platillos deliciosos y chistes malos pero encantadores.", icon: "🐹" },
    "Suga": { desc: "Tu alma gemela es Suga (Yoongi). Prefieres los espacios tranquilos, el silencio cómodo y un apoyo incondicional pero sutil. Su conexión es profunda, basada en la lealtad y el arte.", icon: "🐱" },
    "J-Hope": { desc: "Tu alma gemela es J-Hope (Hoseok). Eres una chispa de luz y te encanta la gente optimista que te empuja a brillar. Bailar, sonreír y llenar tus días de colores neón y energía positiva es lo tuyo.", icon: "🐿️" },
    "Jimin": { desc: "Tu alma gemela es Jimin. Eres una persona sumamente cariñosa y atenta. Te mereces a alguien que cuide de ti, te abrace en los momentos fríos y te escuche siempre con el corazón abierto.", icon: "🐥" },
    "V": { desc: "Tu alma gemela es V (Taehyung). Eres un alma artística, libre y un poco vintage. Compartirán paseos bajo el atardecer, fotos de paisajes hermosos y un estilo de vida bohemio y único.", icon: "🐯" },
    "Jungkook": { desc: "Tu alma gemela es Jungkook. Eres competitiva, juguetona y muy apasionada. Te mereces un Golden Maknae que te acompañe en cada locura, cante para ti por las noches y te proteja con lealtad inquebrantable.", icon: "🐰" }
};

function startQuiz() {
    quizStartScreen.classList.add("hidden");
    quizQuestionBox.classList.remove("hidden");
    quizResultBox.classList.add("hidden");
    quizCurrentQuestion = 0;
    quizScores = { "RM": 0, "Jin": 0, "Suga": 0, "J-Hope": 0, "Jimin": 0, "V": 0, "Jungkook": 0 };
    showQuestion();
}

function showQuestion() {
    const q = quizQuestions[quizCurrentQuestion];
    quizQuestionText.textContent = q.question;
    currentQuestionNum.textContent = quizCurrentQuestion + 1;
    quizOptionsContainer.innerHTML = "";

    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "quiz-option-btn";
        btn.textContent = opt.text;
        btn.addEventListener("click", () => selectOption(opt.member));
        quizOptionsContainer.appendChild(btn);
    });
}

function selectOption(member) {
    quizScores[member] = (quizScores[member] || 0) + 1;
    quizCurrentQuestion++;

    if (quizCurrentQuestion < quizQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizQuestionBox.classList.add("hidden");
    quizResultBox.classList.remove("hidden");

    let topMember = "Jungkook";
    let maxScore = -1;

    for (let m in quizScores) {
        if (quizScores[m] > maxScore) {
            maxScore = quizScores[m];
            topMember = m;
        }
    }

    const profile = memberProfiles[topMember];
    document.getElementById("resultName").textContent = topMember;
    document.getElementById("resultDesc").textContent = profile.desc;
    document.getElementById("resultAvatar").textContent = profile.icon;
}

function resetQuiz() {
    quizResultBox.classList.add("hidden");
    quizStartScreen.classList.remove("hidden");
}


// ==========================================
// INTERACCIONES DEL PANEL ESPECIAL (ARMY QUEEN)
// ==========================================

// Abrir y Cerrar Cartas 3D
function toggleLetter(wrapperEl) {
    const allWrappers = document.querySelectorAll(".envelope-wrapper");
    allWrappers.forEach(w => {
        if (w !== wrapperEl) {
            w.classList.remove("open");
        }
    });
    wrapperEl.classList.toggle("open");
}

// Galería Polaroid Zoom
const polaroidOverlay = document.getElementById("polaroidOverlay");
const zoomedPolaroid = document.getElementById("zoomedPolaroid");

function zoomPolaroid(cardEl) {
    zoomedPolaroid.innerHTML = cardEl.innerHTML;
    polaroidOverlay.classList.remove("hidden");
    polaroidOverlay.style.opacity = "0";

    setTimeout(() => {
        polaroidOverlay.style.opacity = "1";
        polaroidOverlay.style.transition = "opacity 0.3s ease";
    }, 50);
}

function closePolaroidZoom() {
    polaroidOverlay.style.opacity = "0";
    setTimeout(() => {
        polaroidOverlay.classList.add("hidden");
    }, 300);
}

// Botón de Señal de Amor
const signalFeedback = document.getElementById("signalFeedback");
const signalsSentKey = "love_signals_sent";

const lovePhrases = [
    "¡Señales enviadas! Jorge acaba de recibir un abrazo virtual. 💜",
    "¡Señal recibida! El corazón de Jorge latió más fuerte justo ahora. 💓",
    "¡Enviado! Jorge está sonriendo al pensar en ti. 🥰",
    "Señal mágica enviada. Prepárate para un mensaje lindo muy pronto. 💌",
    "¡Borahae! Tu amor ha viajado por el ciberespacio con éxito. 🚀🌌"
];

function sendLoveSignal() {
    const button = document.querySelector(".btn-love-signal");
    const rect = button.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top;

    for (let i = 0; i < 12; i++) {
        const size = Math.random() * 18 + 8;
        const speedY = Math.random() * 3 + 1.5;
        const color = i % 2 === 0 ? "rgba(255, 215, 0, 0.7)" : "rgba(255, 107, 181, 0.7)";
        const heart = new HeartParticle(btnX, btnY, speedY, size, color);
        heart.speedX = Math.random() * 4 - 2;
        floatingHearts.push(heart);
    }

    let count = parseInt(localStorage.getItem(signalsSentKey) || "0");
    count++;
    localStorage.setItem(signalsSentKey, count.toString());

    const randomPhrase = lovePhrases[Math.floor(Math.random() * lovePhrases.length)];
    signalFeedback.innerHTML = `✨ <strong>${randomPhrase}</strong> (Señal #${count})`;
}
