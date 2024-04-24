// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
  onSnapshot,
  where,
  query,
  addDoc,
} from "firebase/firestore";
import {
  getAuth,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateEmail,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnXM8_i6cN9ZLXyRBJCSU_8e8Uc9NMklI",
  authDomain: "student-portal-2d8f1.firebaseapp.com",
  projectId: "student-portal-2d8f1",
  storageBucket: "student-portal-2d8f1.appspot.com",
  messagingSenderId: "696060256689",
  appId: "1:696060256689:web:814ced33b90706802edd90",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {
  app,
  firestore,
  auth,
  storage,
  updateDoc,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateEmail,
  sendPasswordResetEmail,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
  where,
  collection,
  onSnapshot,
  query,
  addDoc,
};
