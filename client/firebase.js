// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-app-1d4e7.firebaseapp.com",
  projectId: "mern-app-1d4e7",
  storageBucket: "mern-app-1d4e7.appspot.com",
  messagingSenderId: "891284410441",
  appId: "1:891284410441:web:4adf2664b5939ea2e4ef98"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);