import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase config from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAJqIUCMJODV1ydb-Us_btPmd6TK_qw3-c",
  authDomain: "jurnl-31188.firebaseapp.com",
  projectId: "jurnl-31188",
  storageBucket: "jurnl-31188.firebasestorage.app",
  messagingSenderId: "486356194760",
  appId: "1:486356194760:web:e36f4b3cf2d169129a9cfd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
