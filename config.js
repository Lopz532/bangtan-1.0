// Inicialización centralizada de Firebase usando variables de entorno de Vite
const env = import.meta.env || {};

function envValue(name, fallback = "") {
    const value = env[name] || fallback;
    return String(value).trim().replace(/^["']|["']$/g, "");
}

const firebaseConfig = {
    apiKey: envValue("VITE_FIREBASE_API_KEY", "AIzaSyDao8ocv_42bU4-jMAbd_q445Co9nLcOho"),
    authDomain: envValue("VITE_FIREBASE_AUTH_DOMAIN", "bangtan-love-space.firebaseapp.com"),
    projectId: envValue("VITE_FIREBASE_PROJECT_ID", "bangtan-love-space"),
    storageBucket: envValue("VITE_FIREBASE_STORAGE_BUCKET", "bangtan-love-space.firebasestorage.app"),
    messagingSenderId: envValue("VITE_FIREBASE_MESSAGING_SENDER_ID", "965693355311"),
    appId: envValue("VITE_FIREBASE_APP_ID", "1:965693355311:web:458351ac5695a68b939dda")
};

export const firebase = window.firebase;

if (!firebase) {
    throw new Error("Firebase SDK no se cargó. Revisa que los scripts de Firebase estén antes del script de la página.");
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();

// CAMBIA ESTO POR EL CORREO ELECTRÓNICO REAL DE TU NOVIA
export const QUEEN_EMAIL = envValue("VITE_QUEEN_EMAIL", "viky050108@gmail.com");

export function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

export function isQueenUser(userOrEmail) {
    const email = typeof userOrEmail === "string" ? userOrEmail : userOrEmail?.email;
    return normalizeEmail(email) === normalizeEmail(QUEEN_EMAIL);
}

export function appUrl(page) {
    const base = envValue("BASE_URL", "/");
    const cleanBase = base.endsWith("/") ? base : `${base}/`;
    const cleanPage = page.replace(/^\/+/, "");
    return `${cleanBase}${cleanPage}`;
}
