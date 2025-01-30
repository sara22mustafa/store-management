// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/cordova";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaTFwB-3z16QiPg_fW935xplvZkZ8Ud2M",
  authDomain: "realtimesalesapp.firebaseapp.com",
  projectId: "realtimesalesapp",
  storageBucket: "realtimesalesapp.firebasestorage.app",
  messagingSenderId: "186220935154",
  appId: "1:186220935154:web:11a656a24d83f17aef5d6b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);
export const database =getFirestore(app);


