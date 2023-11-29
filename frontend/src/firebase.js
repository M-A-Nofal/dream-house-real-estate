// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-daf72.firebaseapp.com",
  projectId: "real-estate-daf72",
  storageBucket: "real-estate-daf72.appspot.com",
  messagingSenderId: "822434379033",
  appId: "1:822434379033:web:7eab8603654e314dcdc188",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
