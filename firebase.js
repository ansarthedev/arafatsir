import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkqjF_qJu9SqVPXF9jWk3Pan5pHP3AUBg",
  authDomain: "ansar-200723.firebaseapp.com",
  projectId: "ansar-200723",
  storageBucket: "ansar-200723.firebasestorage.app",
  messagingSenderId: "216599671762",
  appId: "1:216599671762:web:f75a3cc66d396ec6c44e0b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };