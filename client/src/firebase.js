import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth2-27938.firebaseapp.com",
  projectId: "mern-auth2-27938",
  storageBucket: "mern-auth2-27938.firebasestorage.app",
  messagingSenderId: "1007378799653",
  appId: "1:1007378799653:web:be12e17f07c16da317f3cc"
};

 export const app = initializeApp(firebaseConfig);

 const db = getFirestore(app);

export { db };