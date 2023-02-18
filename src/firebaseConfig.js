// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtuD6OgTtNmIIe03UeMAG0Ja32CPmN6GQ",
  authDomain: "react-reciepe-app-c927f.firebaseapp.com",
  projectId: "react-reciepe-app-c927f",
  storageBucket: "react-reciepe-app-c927f.appspot.com",
  messagingSenderId: "457480542868",
  appId: "1:457480542868:web:4c3472dfd60c1d31b9b281",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, database, db, auth };
