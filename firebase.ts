import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA1pcKAPAiHIGEHTpYu437ge4PXEtCUZqk",
  authDomain: "aleymi-3c5b5.firebaseapp.com",
  projectId: "aleymi-3c5b5",
  storageBucket: "aleymi-3c5b5.firebasestorage.app",
  messagingSenderId: "817257038449",
  appId: "1:817257038449:web:37e1f595a8e7af869b91d0",
  measurementId: "G-YNQMQGYKB8"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;