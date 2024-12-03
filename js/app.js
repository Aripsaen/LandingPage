// Inicializa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Configuración de Firebase (reemplaza con tu propia configuración)
const firebaseConfig = {
  apiKey: "AIzaSyCZmgs1AJSc1EXfVvUPZjC2p-KzjOR_RyY",
  authDomain: "landing-page-b0cc9.firebaseapp.com",
  databaseURL: "https://landing-page-b0cc9-default-rtdb.firebaseio.com",
  projectId: "landing-page-b0cc9",
  storageBucket: "landing-page-b0cc9.firebasestorage.app",
  messagingSenderId: "412328195260",
  appId: "1:412328195260:web:dad3a7cd0255feba97ccb9",
  measurementId: "G-LWZX40W813"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

function writeUserData(user, name, email, imageUrl) {
    const db = getDatabase();
    const reference = ref(db, 'users/' + userId);

    set(reference, {
        username: name,
        email: email,
        profile_picture : imageUrl
    });
  
};

writeUserData('1', 'name', 'email', 'imageUrl');