
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBKxyaWMf9HhSGPnY6Ky_ygds18ETGvFjc",
    authDomain: "reactchat-efd5d.firebaseapp.com",
    projectId: "reactchat-efd5d",
    storageBucket: "reactchat-efd5d.appspot.com",
    messagingSenderId: "932906594876",
    appId: "1:932906594876:web:cdad408a70ac02e2020939"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage(app)