import { appUrl, auth, db, firebase, isQueenUser } from './config.js';

// Lista de Canciones de Éxitos reales para ARMY (Archive.org streams estables)
const generalPlaylist = [
    { 
        title: "Dynamite", 
        artist: "BTS",
        url: "https://archive.org/download/bts-dynamite/BTS%20-%20Dynamite.mp3"
    },
    { 
        title: "Butter", 
        artist: "BTS",
        url: "https://archive.org/download/bts-butter/BTS%20-%20Butter.mp3"
    },
    { 
        title: "Boy With Luv", 
        artist: "BTS feat. Halsey",
        url: "https://archive.org/download/bts-boy-with-luv/BTS%20-%20Boy%20With%20Luv.mp3"
    },
    { 
        title: "Spring Day", 
        artist: "BTS",
        url: "https://archive.org/download/bts-spring-day/BTS%20-%20Spring%20Day.mp3"
    },
    { 
        title: "Fake Love", 
        artist: "BTS",
        url: "https://archive.org/download/bts-fake-love/BTS%20-%20Fake%20Love.mp3"
    }
];

let currentGeneralTrackIndex = 0;
let isGeneralPlaying = false;

// ==========================================
// SEGURIDAD: CONTROL DE SESIÓN
// ==========================================
auth.onAuthStateChanged((user) => {
    if (!user) {
        // Redirigir a login si no está autenticado
        window.location.replace(appUrl("index.html"));
    } else if (isQueenUser(user)) {
        window.location.replace(appUrl("queen.html"));
    } else {
        const dispName = user.displayName || user.email.split('@')[0];
        document.getElementById("armyUserName").textContent = dispName;
        
        // Inicializar componentes interactivos
        loadHeartWall();
        loadGeneralPlayerTrack(0);
    }
});

// Cerrar sesión
document.getElementById("btnLogout").addEventListener("click", () => {
    audioElement.pause();
    if (window.heartWallUnsubscribe) {
        window.heartWallUnsubscribe();
    }
    auth.signOut().then(() => {
        window.location.replace(appUrl("index.html"));
    });
});


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
// REPRODUCTOR DE MÚSICA REAL (ARMY)
// ==========================================
const audioElement = document.getElementById("audioElement");
const generalVinyl = document.getElementById("generalVinyl");
const generalArm = document.getElementById("generalArm");
const generalPlayBtn = document.getElementById("generalPlayBtn");
const generalTrackTitle = document.getElementById("generalTrackTitle");
const generalTrackArtist = document.getElementById("generalTrackArtist");
const generalProgress = document.getElementById("generalProgress");
const generalProgressContainer = document.getElementById("generalProgressContainer");

function loadGeneralPlayerTrack(index) {
    currentGeneralTrackIndex = index;
    const track = generalPlaylist[index];
    generalTrackTitle.textContent = track.title;
    generalTrackArtist.textContent = track.artist;
    
    // Cargar url en elemento de audio real
    audioElement.src = track.url;
    audioElement.load();
    generalProgress.style.width = "0%";
    
    if (isGeneralPlaying) {
        audioElement.play().catch(err => console.log("Auto-play prevenido por el navegador", err));
    }
}

function playGeneralPlayer() {
    isGeneralPlaying = true;
    generalVinyl.classList.add("playing");
    generalArm.classList.add("playing");
    generalPlayBtn.textContent = "⏸️";
    audioElement.play().catch(err => {
        console.error("Error al reproducir audio:", err);
        isGeneralPlaying = false;
        generalVinyl.classList.remove("playing");
        generalArm.classList.remove("playing");
        generalPlayBtn.textContent = "▶️";
    });
}

function pauseGeneralPlayer() {
    isGeneralPlaying = false;
    generalVinyl.classList.remove("playing");
    generalArm.classList.remove("playing");
    generalPlayBtn.textContent = "▶️";
    audioElement.pause();
}

// Actualizar barra de progreso del audio en tiempo real
audioElement.addEventListener("timeupdate", () => {
    if (audioElement.duration) {
        const percentage = (audioElement.currentTime / audioElement.duration) * 100;
        generalProgress.style.width = `${percentage}%`;
    }
});

// Avanzar pista automáticamente al finalizar la canción
audioElement.addEventListener("ended", () => {
    nextGeneralTrack();
});

// Control manual del progreso haciendo clic
generalProgressContainer.addEventListener("click", (e) => {
    const rect = generalProgressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    
    if (audioElement.duration) {
        audioElement.currentTime = percentage * audioElement.duration;
    }
});

function nextGeneralTrack() {
    let index = currentGeneralTrackIndex + 1;
    if (index >= generalPlaylist.length) index = 0;
    loadGeneralPlayerTrack(index);
    if (isGeneralPlaying) playGeneralPlayer();
}

function prevGeneralTrack() {
    let index = currentGeneralTrackIndex - 1;
    if (index < 0) index = generalPlaylist.length - 1;
    loadGeneralPlayerTrack(index);
    if (isGeneralPlaying) playGeneralPlayer();
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
// MURO DE CORAZONES EN TIEMPO REAL CON FIRESTORE
// ==========================================
const heartWall = document.getElementById("heartWall");
const heartForm = document.getElementById("heartForm");
const heartMessage = document.getElementById("heartMessage");
let selectedColor = "purple";

// Selector de color de corazones
const colorDots = document.querySelectorAll(".color-dot");
colorDots.forEach(dot => {
    dot.addEventListener("click", () => {
        colorDots.forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
        selectedColor = dot.getAttribute("data-color");
    });
});

function loadHeartWall() {
    if (window.heartWallUnsubscribe) {
        window.heartWallUnsubscribe();
    }

    // Oyente en tiempo real de los últimos 30 mensajes
    window.heartWallUnsubscribe = db.collection("heart_messages")
        .orderBy("timestamp", "asc")
        .limitToLast(30)
        .onSnapshot((snapshot) => {
            heartWall.innerHTML = "";
            snapshot.forEach((doc) => {
                const msg = doc.data();
                const heartEl = document.createElement("div");
                heartEl.className = `glowing-heart-msg theme-${msg.color || 'purple'}`;
                heartEl.title = "Mantener presionado para eliminar";
                heartEl.innerHTML = `<span>💜</span> <span class="heart-msg-text">${escapeHTML(msg.message)}</span>`;
                bindDeleteOnHold(heartEl, doc.id);
                heartWall.appendChild(heartEl);
            });

            const container = document.querySelector(".heart-wall-container");
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, (error) => {
            console.error("Error al cargar muro de corazones:", error);
        });
}

function bindDeleteOnHold(element, messageId) {
    let holdTimer = null;
    let deleteStarted = false;

    const clearHold = () => {
        if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
        }
        element.classList.remove("delete-pending");
    };

    const requestDelete = () => {
        deleteStarted = true;
        element.classList.remove("delete-pending");

        const shouldDelete = window.confirm("Eliminar este mensaje del muro?");
        if (!shouldDelete) return;

        db.collection("heart_messages").doc(messageId).delete()
            .catch((error) => {
                console.error("Error al eliminar mensaje:", error);
                alert("No se pudo eliminar el mensaje: " + error.message);
            });
    };

    element.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        deleteStarted = false;
        element.classList.add("delete-pending");
        holdTimer = setTimeout(requestDelete, 750);
    });

    element.addEventListener("pointerup", clearHold);
    element.addEventListener("pointercancel", clearHold);
    element.addEventListener("pointerleave", clearHold);
    element.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        if (!deleteStarted) requestDelete();
    });
}

heartForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msgText = heartMessage.value.trim();
    if (!msgText) return;

    const currentUser = auth.currentUser;
    if (!currentUser) return;

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
        console.error("Error al enviar mensaje:", error);
        alert("Error al enviar el corazón en tiempo real: " + error.message);
    });
});

function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}


// ==========================================
// QUIZ: TU ALMA GEMELA DE BTS
// ==========================================
const quizStartScreen = document.getElementById("quizStartScreen");
const quizQuestionBox = document.getElementById("quizQuestionBox");
const quizResultBox = document.getElementById("quizResultBox");
const quizQuestionText = document.getElementById("quizQuestionText");
const quizOptionsContainer = document.getElementById("quizOptionsContainer");
const currentQuestionNum = document.getElementById("currentQuestionNum");
let quizCurrentQuestion = 0;
let quizScores = {};

const quizQuestions = [
    {
        question: "Que plan te suena mas perfecto?",
        options: [
            { text: "Museo, cafe y una charla profunda", member: "RM" },
            { text: "Cocinar algo rico y reir sin parar", member: "Jin" },
            { text: "Noche tranquila con musica y calma", member: "Suga" },
            { text: "Bailar, salir y llenar el dia de energia", member: "J-Hope" }
        ]
    },
    {
        question: "Que detalle te enamora mas?",
        options: [
            { text: "Que te escuchen con mucha ternura", member: "Jimin" },
            { text: "Una sorpresa artistica y diferente", member: "V" },
            { text: "Una promesa leal y protectora", member: "Jungkook" },
            { text: "Un consejo inteligente justo a tiempo", member: "RM" }
        ]
    },
    {
        question: "Elige una vibra para tu corazon:",
        options: [
            { text: "Dulce, divertida y luminosa", member: "Jin" },
            { text: "Reservada, intensa y fiel", member: "Suga" },
            { text: "Brillante, optimista y valiente", member: "J-Hope" },
            { text: "Romantica, cuidadosa y suave", member: "Jimin" }
        ]
    },
    {
        question: "Que regalo guardarias para siempre?",
        options: [
            { text: "Una foto vintage con una nota secreta", member: "V" },
            { text: "Una cancion cantada solo para ti", member: "Jungkook" },
            { text: "Un libro marcado con frases especiales", member: "RM" },
            { text: "Una cena hecha con mucho carino", member: "Jin" }
        ]
    },
    {
        question: "En un dia dificil necesitas a alguien que...",
        options: [
            { text: "Te acompane en silencio y te sostenga", member: "Suga" },
            { text: "Te haga sonreir hasta olvidar la tristeza", member: "J-Hope" },
            { text: "Te abrace y cuide cada detalle", member: "Jimin" },
            { text: "Se quede contigo hasta que todo mejore", member: "Jungkook" }
        ]
    }
];

const memberProfiles = {
    "RM": { desc: "Tu alma gemela es RM (Namjoon). Eres compatible con él por tu amor por las conversaciones profundas, el arte y los libros. Te encantará compartir tés calientes y caminatas por museos.", icon: "🐨" },
    "Jin": { desc: "Tu alma gemela es Jin. Adoras las risas sinceras, la comida reconfortante y la gente con buena vibra que no teme verse divertida. Tus días con él estarán llenos de platillos deliciosos y chistes malos pero encantadores.", icon: "🐹" },
    "Suga": { desc: "Tu alma gemela es Suga (Yoongi). Prefieres los espacios tranquilos, el silencio cómodo y un apoyo incondicional pero sutil. Su conexión es profunda, basada en la lealtad y el arte.", icon: "🐱" },
    "J-Hope": { desc: "Tu alma gemela es J-Hope (Hoseok). Eres una chispa de luz y te encanta la gente optimista que te empuja a brillar. Bailar, sonreír y llenar tus días de colores neón y energía positiva es lo tuyo.", icon: "🐿️" },
    "Jimin": { desc: "Tu alma gemela es Jimin. Eres una persona sumamente cariñosa y atenta. Te mereces a alguien que cuide de ti, te abrace en los momentos fríos y te escuche siempre con el corazón abierto.", icon: "🐥" },
    "V": { desc: "Tu alma gemela es V (Taehyung). Eres un alma artística, libre y un poco vintage. Compartirán paseos bajo el atardecer, fotos de paisajes hermosos y un estilo de vida bohemio y único.", icon: "🐯" },
    "Jungkook": { desc: "Tu alma gemela es Jungkook. Eres competitiva, juguetona y muy apasionada. Te mereces un Golden Maknae que te acompañe en cada locura, cante para ti por las noches y te proteja con lealtad inquebrantable.", icon: "🐰" }
};

window.startQuiz = function() {
    quizStartScreen.classList.add("hidden");
    quizQuestionBox.classList.remove("hidden");
    quizResultBox.classList.add("hidden");
    quizCurrentQuestion = 0;
    quizScores = { "RM": 0, "Jin": 0, "Suga": 0, "J-Hope": 0, "Jimin": 0, "V": 0, "Jungkook": 0 };
    showQuestion();
};

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

window.resetQuiz = function() {
    quizResultBox.classList.add("hidden");
    quizStartScreen.classList.remove("hidden");
};
