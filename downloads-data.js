// downloads-data.js

// Firebase Web SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Replace with your Firebase web config (from Project Settings > Web app)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "bookdownloadtracker.firebaseapp.com",
  projectId: "bookdownloadtracker",
  storageBucket: "bookdownloadtracker.appspot.com",
  messagingSenderId: "YOUR_MSG_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch download data
const q = query(collection(db, "downloads"), orderBy("timestamp", "desc"));

let downloadData = [];

getDocs(q)
  .then(snapshot => {
    downloadData = snapshot.docs.map(doc => doc.data());

    const tableBody = document.querySelector('#trackingTable tbody');
    if (downloadData.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4">No data yet.</td></tr>`;
      return;
    }

    downloadData.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.book}</td>
        <td>${entry.format}</td>
        <td>${new Date(entry.timestamp).toLocaleString()}</td>
        <td>${entry.ip || '–'}</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error("Error loading downloads:", error);
    const tableBody = document.querySelector('#trackingTable tbody');
    tableBody.innerHTML = `<tr><td colspan="4">Error loading data.</td></tr>`;
  });
