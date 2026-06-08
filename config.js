// Inicialización centralizada de Firebase usando variables de entorno de Vite
const env = import.meta.env || {};

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDao8ocv_42bU4-jMAbd_q445Co9nLcOho",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "bangtan-love-space.firebaseapp.com",
    projectId: env.VITE_FIREBASE_PROJECT_ID || "bangtan-love-space",
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "bangtan-love-space.firebasestorage.app",
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "965693355311",
    appId: env.VITE_FIREBASE_APP_ID || "1:965693355311:web:458351ac5695a68b939dda"
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
export const QUEEN_EMAIL = env.VITE_QUEEN_EMAIL || "jorgelopz532@gmail.com";

export function appUrl(page) {
    const base = env.BASE_URL || "/";
    const cleanBase = base.endsWith("/") ? base : `${base}/`;
    const cleanPage = page.replace(/^\/+/, "");
    return `${cleanBase}${cleanPage}`;
}
