// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC6dimgR9F_4HCeju8UUXDy1iaPW_zphak",
    authDomain: "sosal-31d0f.firebaseapp.com",
    projectId: "sosal-31d0f",
    storageBucket: "sosal-31d0f.appspot.com",
    messagingSenderId: "455142259889",
    appId: "1:455142259889:web:77a1a642515316b7d7b690",
    measurementId: "G-2NHL2PSEV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth, analytics };
