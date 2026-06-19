/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ══════════════════════════════════════════════════════════════════════════════
//  🔥 KURULUM TALİMATLARI
//  ────────────────────────────────────────────────────────────────────────────
//  1. https://console.firebase.google.com adresine gidin
//  2. Yeni proje oluşturun
//  3. Authentication > Sign-in method > Google'ı etkinleştirin
//  4. Firestore Database > Create Database (production mode)
//  5. Project Settings > Your apps > Web app ekle > Config kopyala
//  6. Aşağıdaki firebaseConfig değerlerini doldurun
//  7. ALLOWED_EMAILS ve ADMIN_EMAILS listelerini güncelleyin
//  8. Firestore Security Rules:
//
//     rules_version = '2';
//     service cloud.firestore {
//       match /databases/{database}/documents {
//         match /series/{seriesId} {
//           allow read, create, update: if request.auth != null;
//           allow delete: if request.auth.token.email in ['admin@gmail.com'];
//         }
//       }
//     }
// ══════════════════════════════════════════════════════════════════════════════

// ─── Firebase Config ───────────────────────────────────────────────────────
// Reads values from Vite env vars when available. Set these in Vercel as
// VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
// VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID
// Local fallback values are preserved below for convenience.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAadSooE76GcjjqwfSsg-2Czj4-7-2sAYs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tracker-e80a3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tracker-e80a3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tracker-e80a3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "28946114019",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:28946114019:web:e07a686ee6eae15025ecd6",
};

// Demo mod tespiti (config değiştirilmedi mi?)
export const IS_DEMO_MODE = firebaseConfig.apiKey.includes("DEMO");

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ──────────────────────────────────────────────────────────────────────────────
//  İzin verilen e-posta adresleri (küçük harf yazın)
//  Boş bırakırsanız tüm Google hesapları giriş yapabilir.
// ──────────────────────────────────────────────────────────────────────────────
// Allowed emails can be provided via the Vite env `VITE_ALLOWED_EMAILS`
// as a comma-separated list. If empty, all Google accounts can sign in.
export const ALLOWED_EMAILS: string[] =
  import.meta.env.VITE_ALLOWED_EMAILS
    ? String(import.meta.env.VITE_ALLOWED_EMAILS)
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : [];

// Admin e-posta adresleri (seri silme yetkisi)
// Admin emails (can delete series). Supply via `VITE_ADMIN_EMAILS` env var.
export const ADMIN_EMAILS: string[] =
  import.meta.env.VITE_ADMIN_EMAILS
    ? String(import.meta.env.VITE_ADMIN_EMAILS)
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : [];
