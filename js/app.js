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

document.getElementById("form-galeria").addEventListener("submit", async (event) => {
  event.preventDefault();

  const imagenInput = document.getElementById("imagen");
  const nombreInsecto = document.getElementById("nombreInsecto").value;
  const nombreUsuario = document.getElementById("nombreUsuario").value;
  const instagram = document.getElementById("instagram").value;

  // Verificar si se ha seleccionado una imagen
  if (imagenInput.files.length === 0) {
    alert("Por favor, selecciona una imagen.");
    return;
  }

  const imagenFile = imagenInput.files[0];
  const imagenRef = ref(storage, "insectos/" + imagenFile.name);

  try {
    // Subir la imagen a Firebase Storage
    const snapshot = await uploadBytes(imagenRef, imagenFile);
    console.log("Imagen subida con éxito!", snapshot);

    // Obtener la URL de la imagen subida
    const imageURL = await getDownloadURL(snapshot.ref);

    // Crear un nuevo documento en Firestore
    const docRef = await addDoc(collection(db, "galeria-fans"), {
      nombreInsecto: nombreInsecto,
      nombreUsuario: nombreUsuario || "Anónimo",
      instagram: instagram || "",
      imagenURL: imageURL,
      fecha: new Date(),
    });

    console.log("Documento escrito con ID: ", docRef.id);

    // Limpiar el formulario después de subir la imagen
    document.getElementById("form-galeria").reset();

    // Actualizar la galería de imágenes
    cargarGaleria();
    
  } catch (error) {
    console.error("Error subiendo la imagen: ", error);
  }
});

// Cargar las imágenes de la galería desde Firestore
async function cargarGaleria() {
  try {
    const querySnapshot = await getDocs(collection(db, "galeria-fans"));
    const galeriaDiv = document.getElementById("imagenes-fans");

    galeriaDiv.innerHTML = ""; // Limpiar la galería antes de recargar

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.classList.add("col-md-4", "mb-4");

      div.innerHTML = `
        <div class="card">
          <img src="${data.imagenURL}" class="card-img-top" alt="${data.nombreInsecto}">
          <div class="card-body">
            <h5 class="card-title">${data.nombreInsecto}</h5>
            <p class="card-text">Por ${data.nombreUsuario}</p>
            <p class="card-text">Instagram: ${data.instagram || "No disponible"}</p>
          </div>
        </div>
      `;
      
      galeriaDiv.appendChild(div);
    });
  } catch (error) {
    console.error("Error cargando la galería: ", error);
  }
}

// Llamar a la función para cargar la galería al cargar la página
window.onload = cargarGaleria;
