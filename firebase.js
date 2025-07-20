// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAk6nF3CsDNnIhOwsOu492k8JmEkNQNrFo",
  authDomain: "docs-editor-b5264.firebaseapp.com",
  projectId: "docs-editor-b5264",
  storageBucket: "docs-editor-b5264.firebasestorage.app",
  messagingSenderId: "918443740327",
  appId: "1:918443740327:web:598e895550b32088015f82",
  measurementId: "G-NMT33MLZEE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();



const logout = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("User signed out");
      window.location.href = "/login";
    })
    .catch((error) => {
      console.error("Sign out error:", error);
    });
};


export { auth, provider, signInWithPopup, signOut, logout };
