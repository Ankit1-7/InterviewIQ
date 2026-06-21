
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "intervewiq.firebaseapp.com",
  projectId: "intervewiq",
  storageBucket: "intervewiq.firebasestorage.app",
  messagingSenderId: "127662909542",
  appId: "1:127662909542:web:742f43df906d5fa78fe5a7"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}