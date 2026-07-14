import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpdeRr4PBPdehECN4xh2sZz6jiKifkocs",
  authDomain: "paps-data-app.firebaseapp.com",
  projectId: "paps-data-app",
  storageBucket: "paps-data-app.firebasestorage.app",
  messagingSenderId: "1034651900444",
  appId: "1:1034651900444:web:e849ecef47877a6a2ef303",
  measurementId: "G-YTY51DWKJ6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFetch() {
  try {
    const q = query(collection(db, "paps_records"));
    const snapshot = await getDocs(q);
    console.log("Total records:", snapshot.size);
    snapshot.forEach(doc => {
      console.log(doc.id, doc.data());
    });
  } catch(e) {
    console.error("Error:", e);
  }
}

testFetch();
