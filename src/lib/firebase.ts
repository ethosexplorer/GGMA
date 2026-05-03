import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const cleanEnv = (key: string | undefined) => (key || "dummy").replace(/["']/g, "");

const firebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: cleanEnv(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID)
};

let app;
let auth: any;

try {
  app = initializeApp(firebaseConfig, "ggp-auth");
  auth = getAuth(app);
} catch (e) {
  console.error("Firebase Initialization Error (Keys likely missing from Vercel):", e);
}

export { auth };
