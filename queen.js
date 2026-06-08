import { appUrl, auth, isQueenUser } from './config.js';

const ANNIVERSARY_DATE = new Date("2025-12-13T00:00:00");

// Lista de Canciones especiales de Jungkook y BTS (Archive.org streams reales)
const specialPlaylist = [
    {
        title: "Still With You",
        artist: "Jungkook",
        url: "https://archive.org/download/jungkook-still-with-you/Jungkook%20-%20Still%20With%20You.mp3",
        dedication: "Esta canción de Jungkook me hace pensar en ti siempre... En los días de lluvia y en los días soleados, mi deseo es estar 'Aún contigo' en cada paso que demos. Eres mi refugio seguro. 💜"
    },
    {
        title: "Euphoria",
        artist: "Jungkook",
        url: "https://archive.org/download/bts-euphoria/BTS%20-%20Euphoria.mp3",
        dedication: "Eres mi euforia, Valentina, la persona que hace que mi mundo brille de una forma especial. Escuchar esta canción es escuchar lo que siento cuando te veo sonreír. ¡Eres la causa de mi euforia! 👑"
    },
    {
        title: "Spring Day",
        artist: "BTS",
        url: "https://archive.org/download/bts-spring-day/BTS%20-%20Spring%20Day.mp3",
        dedication: "Aunque pasen los días fríos o la distancia nos separe por momentos, siempre te esperaré y te buscaré. Eres mi primavera eterna, mi día soleado favorito. 🌸"
    },
    {
        title: "Seven",
        artist: "Jungkook feat. Latto",
        url: "https://archive.org/download/jungkook-seven-feat.-latto-clean-ver./Jungkook%20-%20Seven%20%28feat.%20Latto%29%20%28Clean%20Ver.%29.mp3",
        dedication: "Te amo los 7 días de la semana, cada hora, cada minuto, cada segundo. Eres mi pensamiento constante de lunes a domingo. Jorge te adora. 🐰✨"
    }
];

let currentSpecialTrackIndex = 0;
let isSpecialPlaying = false;

// ==========================================
// SEGURIDAD: CONTROL DE ACCESO
// ==========================================
auth.onAuthStateChanged((user) => {
    if (!user || !isQueenUser(user)) {
        // Si no está autenticado o no es el correo especial, expulsar
        window.location.replace(appUrl("index.html"));
    } else {
        const dispName = user.displayName || 'My Chaparrita';
        document.getElementById("gfWelcomeText").textContent = `✨ Bienvenida, ${dispName} ✨`;

        // Arrancar Widgets del Panel
        startAnniversaryCounter();
        loadSpecialPlayerTrack(0);
        bindGFEvents();
    }
});

// Cerrar sesión
document.getElementById("btnLogout").addEventListener("click", () => {
    audioElement.pause();
    auth.signOut().then(() => {
        window.location.replace(appUrl("index.html"));
    });
});


// ==========================================
// CANVAS DE ESTRELLAS Y CORAZONES FLOTANTES
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

    // Añadir corazones flotantes lentamente en el fondo
    if (Math.random() < 0.03 && floatingHearts.length < 40) {
        floatingHearts.push(new HeartParticle());
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
// REPRODUCTOR EXCLUSIVO REAL (GF PLAYLIST)
// ==========================================
const audioElement = document.getElementById("audioElement");
const specialVinyl = document.getElementById("specialVinyl");
const specialArm = document.getElementById("specialArm");
const specialPlayBtn = document.getElementById("specialPlayBtn");
const specialTrackTitle = document.getElementById("specialTrackTitle");
const specialTrackArtist = document.getElementById("specialTrackArtist");
const specialProgress = document.getElementById("specialProgress");
const specialProgressContainer = document.getElementById("specialProgressContainer");
const specialDedicationText = document.getElementById("specialDedicationText");

function loadSpecialPlayerTrack(index) {
    currentSpecialTrackIndex = index;
    const track = specialPlaylist[index];
    specialTrackTitle.textContent = track.title;
    specialTrackArtist.textContent = `${track.artist} (Dedicado por Jorge)`;
    specialDedicationText.textContent = track.dedication;

    audioElement.src = track.url;
    audioElement.load();
    specialProgress.style.width = "0%";

    if (isSpecialPlaying) {
        audioElement.play().catch(err => console.log("Auto-play prevenido", err));
    }
}

function playSpecialPlayer() {
    isSpecialPlaying = true;
    specialVinyl.classList.add("playing");
    specialArm.classList.add("playing");
    specialPlayBtn.textContent = "⏸️";
    audioElement.play().catch(err => {
        console.error("Error al reproducir audio:", err);
        isSpecialPlaying = false;
        specialVinyl.classList.remove("playing");
        specialArm.classList.remove("playing");
        specialPlayBtn.textContent = "▶️";
    });
}

function pauseSpecialPlayer() {
    isSpecialPlaying = false;
    specialVinyl.classList.remove("playing");
    specialArm.classList.remove("playing");
    specialPlayBtn.textContent = "▶️";
    audioElement.pause();
}

audioElement.addEventListener("timeupdate", () => {
    if (audioElement.duration) {
        const percentage = (audioElement.currentTime / audioElement.duration) * 100;
        specialProgress.style.width = `${percentage}%`;
    }
});

audioElement.addEventListener("ended", () => {
    nextSpecialTrack();
});

specialProgressContainer.addEventListener("click", (e) => {
    const rect = specialProgressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;

    if (audioElement.duration) {
        audioElement.currentTime = percentage * audioElement.duration;
    }
});

function nextSpecialTrack() {
    let index = currentSpecialTrackIndex + 1;
    if (index >= specialPlaylist.length) index = 0;
    loadSpecialPlayerTrack(index);
    if (isSpecialPlaying) playSpecialPlayer();
}

function prevSpecialTrack() {
    let index = currentSpecialTrackIndex - 1;
    if (index < 0) index = specialPlaylist.length - 1;
    loadSpecialPlayerTrack(index);
    if (isSpecialPlaying) playSpecialPlayer();
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
// INTERACCIONES DEL PANEL (POLAROIDS Y CARTAS)
// ==========================================
const polaroidOverlay = document.getElementById("polaroidOverlay");
const zoomedPolaroid = document.getElementById("zoomedPolaroid");
const signalFeedback = document.getElementById("signalFeedback");
const signalsSentKey = "love_signals_sent";

const lovePhrases = [
    "¡Señales enviadas! Jorge acaba de recibir un abrazo virtual. 💜",
    "¡Señal recibida! El corazón de Jorge latió más fuerte justo ahora. 💓",
    "¡Enviado! Jorge está sonriendo al pensar en ti. 🥰",
    "Señal mágica enviada. Prepárate para un mensaje lindo muy pronto. 💌",
    "¡Borahae! Tu amor ha viajado por el ciberespacio con éxito. 🚀🌌"
];

function toggleLetter(wrapperEl) {
    const allWrappers = document.querySelectorAll(".envelope-wrapper");
    allWrappers.forEach(w => {
        if (w !== wrapperEl) {
            w.classList.remove("open");
        }
    });
    wrapperEl.classList.toggle("open");
}

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

function sendLoveSignal() {
    const button = document.getElementById("btnLoveSignal");
    const rect = button.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top;

    // Lanzar partículas de corazones desde el botón
    for (let i = 0; i < 15; i++) {
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

// Vincular eventos DOM de forma modular
function bindGFEvents() {
    // Polaroids
    document.getElementById("polaroid1").addEventListener("click", () => zoomPolaroid(document.getElementById("polaroid1")));
    document.getElementById("polaroid2").addEventListener("click", () => zoomPolaroid(document.getElementById("polaroid2")));
    document.getElementById("polaroid3").addEventListener("click", () => zoomPolaroid(document.getElementById("polaroid3")));

    // Cartas
    document.getElementById("envelope1").addEventListener("click", () => toggleLetter(document.getElementById("envelope1")));
    document.getElementById("envelope2").addEventListener("click", () => toggleLetter(document.getElementById("envelope2")));
    document.getElementById("envelope3").addEventListener("click", () => toggleLetter(document.getElementById("envelope3")));

    // Botón de señales
    document.getElementById("btnLoveSignal").addEventListener("click", sendLoveSignal);

    // Zoom Overlay Cierre
    document.getElementById("btnCloseZoom").addEventListener("click", closePolaroidZoom);
    polaroidOverlay.addEventListener("click", closePolaroidZoom);
}
