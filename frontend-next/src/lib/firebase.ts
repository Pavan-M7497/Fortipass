import { initializeApp, getApps, getApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const missingFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

let firebaseInitError: string | null = null;

if (missingFirebaseKeys.length > 0) {
  firebaseInitError =
    `Missing Firebase env vars: ${missingFirebaseKeys.join(", ")}. ` +
    "Set them in .env.local (for local) and Vercel Project Settings (for deploys) using NEXT_PUBLIC_FIREBASE_* names.";
}

// Initialize Firebase securely to avoid re-initialization errors in Next.js HMR
let app = null;

if (!firebaseInitError) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (error) {
    firebaseInitError =
      error instanceof Error ? error.message : "Unknown Firebase initialization error";
  }
}

if (firebaseInitError && process.env.NODE_ENV !== "production") {
  console.warn("[FortiPass] Firebase disabled:", firebaseInitError);
}

export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
export const storage: FirebaseStorage | null = app ? getStorage(app) : null;

export const isFirebaseConfigured = !firebaseInitError && !!app;
export const firebaseErrorMessage = firebaseInitError;
export default app;
