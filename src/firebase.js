import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration from environment variables
// Get these values from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCJguqXOfuQfghz4YOtZQb2FeM5revUqYo",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smart-city-auto-reporter.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smart-city-auto-reporter",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smart-city-auto-reporter.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "609725840696",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:609725840696:web:216ba5020f34eddb3c95cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
// Use the techshit database
db._settings = { ...db._settings, databaseId: 'techshit' };
export const storage = getStorage(app);
export const functions = getFunctions(app, 'us-central1');

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
    try {
        analytics = getAnalytics(app);
    } catch (error) {
        console.warn('Analytics initialization failed:', error);
    }
}
export { analytics };

export default app;
