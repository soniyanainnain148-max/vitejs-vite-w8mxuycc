import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Aapki Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAySf4xGt6trm3xT0RFuNXLicjkQTw2fWI",
  authDomain: "arpit-glory.firebaseapp.com",
  projectId: "arpit-glory",
  storageBucket: "arpit-glory.firebasestorage.app",
  messagingSenderId: "611868256278",
  appId: "1:611868256278:web:71bc38b0c8c23ba8536d37"
};

// Firebase Initialize Karein
const app = initializeApp(firebaseConfig);

// Firestore Database Export Karein
export const db = getFirestore(app);
