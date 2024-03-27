// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxOL1vqBGsjmIiIokkz7PKvGKVwSA882M",
  authDomain: "sp6-purple-mileageproject.firebaseapp.com",
  projectId: "sp6-purple-mileageproject",
  storageBucket: "sp6-purple-mileageproject.appspot.com",
  messagingSenderId: "307859401552",
  appId: "1:307859401552:web:36887f0ed0beab2d999a55",
  measurementId: "G-Y47ZHKM2X9"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
