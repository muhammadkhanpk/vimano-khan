import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDt5Ak3zzu4LIBjIHsp8RYaasZgRYAXzdo",
  authDomain: "vimano-95836.firebaseapp.com",
  projectId: "vimano-95836",
  storageBucket: "vimano-95836.appspot.com",
  messagingSenderId: "1001044240957",
  appId: "1:1001044240957:web:dc44090fcb52aff5cbd854",
  measurementId: "G-RYYF733DNG",
};
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { database, db, auth, storage };
