import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 👈 Auth import kiya

const firebaseConfig = {
  apiKey: "AIzaSyAySf4xGt6trm3xT0RFuNXLicjkQTw2fWI",
  authDomain: "arpit-glory.firebaseapp.com",
  projectId: "arpit-glory",
  storageBucket: "arpit-glory.firebasestorage.app",
  messagingSenderId: "611868256278",
  appId: "1:611868256278:web:71bc38b0c8c23ba8536d37"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // 👈 Auth export kiya
