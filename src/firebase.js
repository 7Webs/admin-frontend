// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGB6Gf53bvceHpRmbKpk76x3H14mlp-OI",
  authDomain: "nanoinfluencers-12ca2.firebaseapp.com",
  projectId: "nanoinfluencers-12ca2",
  storageBucket: "nanoinfluencers-12ca2.firebasestorage.app",
  messagingSenderId: "695229200474",
  appId: "1:695229200474:web:2a8ea1cc4fa65f85c28063",
  measurementId: "G-CM9ZP7BG1K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth, analytics };
