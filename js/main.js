import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBVmTKH3RGsEM48jYw7Cv2S5018NKWQp2M",
    authDomain: "new-landing-page-1c364.firebaseapp.com",
    databaseURL: "https://new-landing-page-1c364-default-rtdb.firebaseio.com",
    projectId: "new-landing-page-1c364",
    storageBucket: "new-landing-page-1c364.firebasestorage.app",
    messagingSenderId: "84857422704",
    appId: "1:84857422704:web:41f952e9d858fbe65645b5",
    measurementId: "G-ZDQ8WPREVK"
  };

const databaseURL = 'https://new-landing-page-1c364-default-rtdb.firebaseio.com/collection.json';
const app = initializeApp(firebaseConfig);

let sendData = () => {
    let form = document.getElementById('votation-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.insectos === '0') {
        alert('Por favor selecciona un insecto para votar.');
        return;
    }

    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });

    fetch(databaseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json();
        })
        .then(result => {
            alert('¡Gracias por votar!'); // Maneja la respuesta con un mensaje
            form.reset()
            getData();
        })
        .catch(error => {
            alert('Hubo un error al registrar tu voto. ¡Intenta nuevamente!'); // Maneja el error con un mensaje
        });
}

let getData = async () => {
    try {
        const response = await fetch(databaseURL);

        if (!response.ok) {
            alert('Hemos experimentado un error. ¡Vuelve pronto! response.ok');
        }

        const data = await response.json();
        
        if (data != null) {
            // let countSuscribers = new Map();
            // let countCups = new Map();
            let countVotes = new Map();

            for (let key in data) {
                let { insectos } = data[key];
                console.log(insectos);
                console.log(countVotes);
                console.log(countVotes.get(insectos));
                let count = countVotes.get(insectos) || 0;
                countVotes.set(insectos, count + 1);
            }
            // Mostrar los resultados de la votación en la tabla
            let votationsTable = document.getElementById('votationsTable');
            votationsTable.innerHTML = '';  // Limpiar la tabla antes de agregar los nuevos resultados
            // Mostrar las filas en la tabla con los resultados
            for (let insecto of countVotes.keys()) {
                let insectoName;
                switch (insecto) {
                    case '1': insectoName = 'Escarabajo Hércules'; break;
                    case '2': insectoName = 'Mariposa Morfo'; break;
                    case '3': insectoName = 'Abeja'; break;
                    case '4': insectoName = 'Oruga'; break;
                    case '5': insectoName = 'Mariquita'; break;
                    default: insectoName = 'Desconocido'; break;
                }
                let rowTemplate = `
                    <tr>
                        <td>${insectoName}</td>
                        <td>${countVotes.get(insecto)}</td>
                    </tr>`;
                votationsTable.innerHTML += rowTemplate;
            }

        }
    } catch (error) {
        alert('Hemos experimentado un error. ¡Vuelve pronto! error');
    }
}

let ready = () => {
    console.log('DOM está listo');
    getData();
}

let loaded = (eventLoaded) => {

    let myform = document.getElementById('votation-form');

    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault();
        
        sendData();
    });
}

const database = getDatabase();  // Esto es si ya has inicializado Firebase correctamente en tu proyecto
const storage = getStorage();    // También asegurate de que Firebase Storage esté habilitado

// Referencia al formulario de la galería
const formGaleria = document.getElementById('form-galeria');

// Función para manejar el envío del formulario
formGaleria.addEventListener('submit', async (event) => {
  event.preventDefault();  // Evitar la recarga de la página

  // Obtener los datos del formulario
  const imagenFile = document.getElementById('imagen').files[0];  // Archivo de la imagen
  const nombreInsecto = document.getElementById('nombreInsecto').value;
  const nombreUsuario = document.getElementById('nombreUsuario').value;
  const instagram = document.getElementById('instagram').value;

  if (!imagenFile || !nombreInsecto) {
    alert("Por favor, sube una imagen y el nombre del insecto.");
    return;
  }

  // Crear un nombre único para la imagen (usando timestamp para evitar sobrescribir)
  const imagenName = new Date().getTime() + '-' + imagenFile.name;

  // Crear una referencia al almacenamiento de Firebase Storage
  const imageRef = storageRef(storage, 'imagenes_fans/' + imagenName);

  try {
    // Subir la imagen a Firebase Storage
    await uploadBytes(imageRef, imagenFile);
    console.log('Imagen subida con éxito');

    // Obtener la URL de la imagen cargada
    const imageUrl = await getDownloadURL(imageRef);
    console.log('URL de la imagen: ', imageUrl);

    // Crear un objeto con los datos a subir a la base de datos
    const postData = {
      nombreInsecto: nombreInsecto,
      nombreUsuario: nombreUsuario || null,
      instagram: instagram || null,
      imagenUrl: imageUrl,  // URL de la imagen en Firebase Storage
      saved: new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' })
    };

    // Crear una referencia en la base de datos para la colección "galeria"
    const newPostKey = push(child(ref(database), 'galeria')).key;

    // Subir los datos al Realtime Database bajo el nodo "galeria"
    await set(ref(database, 'galeria/' + newPostKey), postData);
    alert("¡Imagen y datos subidos correctamente!");

    // Limpiar el formulario
    formGaleria.reset();

    // Mostrar la nueva imagen en la galería
    mostrarGaleria();
  } catch (error) {
    console.error('Error al subir la imagen o los datos:', error);
    alert("Hubo un problema al subir la imagen o los datos.");
  }
});

// Función para cargar las imágenes desde la base de datos y mostrarlas en la galería
async function mostrarGaleria() {
  const imagenesFansContainer = document.getElementById('imagenes-fans');
  
  try {
    // Obtener los datos de la galería desde Firebase Realtime Database
    const snapshot = await get(ref(database, 'galeria'));
    const data = snapshot.val();

    if (data) {
      imagenesFansContainer.innerHTML = ''; // Limpiar galería

      for (let key in data) {
        const { nombreInsecto, nombreUsuario, instagram, imagenUrl } = data[key];

        // Crear el HTML para cada imagen
        const cardHTML = `
          <div class="col-md-4 mb-4">
            <div class="card">
              <img src="${imagenUrl}" class="card-img-top" alt="${nombreInsecto}">
              <div class="card-body">
                <h5 class="card-title">${nombreInsecto}</h5>
                ${nombreUsuario ? `<p class="card-text"><strong>Usuario:</strong> ${nombreUsuario}</p>` : ''}
                ${instagram ? `<p class="card-text"><strong>Instagram:</strong> <a href="https://instagram.com/${instagram}" target="_blank">${instagram}</a></p>` : ''}
              </div>
            </div>
          </div>
        `;

        // Agregar la tarjeta a la galería
        imagenesFansContainer.innerHTML += cardHTML;
      }
    }
  } catch (error) {
    console.error('Error al obtener los datos de la galería:', error);
  }
}

document.addEventListener('DOMContentLoaded', mostrarGaleria);
window.addEventListener('DOMContentLoaded', ready);
window.addEventListener('load', loaded);