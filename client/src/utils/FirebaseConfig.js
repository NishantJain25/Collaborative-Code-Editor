// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAMOzihtFxYthWAYAAVnkHpNC8wQfxZjg",
  authDomain: "collabinator-11331.firebaseapp.com",
  projectId: "collabinator-11331",
  storageBucket: "collabinator-11331.appspot.com",
  messagingSenderId: "641133619868",
  appId: "1:641133619868:web:8d8feaa5368137b51f1b59",
  measurementId: "G-7M8BMC9E4V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const provider = new GoogleAuthProvider()

export const createUser = (email, password) => {
  if (!email || !password) {
    console.log("Email and password is required");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      return user;
    })
    .catch((error) => {
      return {error: error.message, code: error.code};
    });
};

export const signIn = async (email, password) => {
  if (!email || !password) {
    console.log("email and password are required");
    return;
  }

  return await signInWithEmailAndPassword(auth, email, password)
    
};

export const signUserOut = () => {
  console.log("signing out");
  signOut(auth)
    .then(() => {
      console.log("User Signed out");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export const onAuthStateChangeListener = (callback) => {
	onAuthStateChanged(auth, callback)
}
