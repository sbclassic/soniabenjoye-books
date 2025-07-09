// Firebase Web SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDoBrw0UEE2Nhk6jLo-6CxLdZjjkdOYhCU",
  authDomain: "bookdownloadtracker.firebaseapp.com",
  projectId: "bookdownloadtracker",
  storageBucket: "bookdownloadtracker.firebasestorage.app",
  messagingSenderId: "973175233369",
  appId: "1:973175233369:web:b4a45e37bcc2976617ca48"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
