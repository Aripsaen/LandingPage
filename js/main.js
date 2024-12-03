let votos = {
    1: { insecto: 'Escarabajo Hércules', votos: 0 },
    2: { insecto: 'Mariposa Morfo', votos: 0 },
    3: { insecto: 'Abeja', votos: 0 },
    4: { insecto: 'Oruga', votos: 0 },
    5: { insecto: 'Mariquita', votos: 0 },
};

// Función para actualizar los resultados de la votación
let actualizarResultados = () => {
    const resultadosTable = document.getElementById("resultados");
    resultadosTable.innerHTML = ''; // Limpiar la tabla antes de actualizar

    // Insertar filas con los resultados
    for (const key in votos) {
        const row = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.textContent = key;
        const td2 = document.createElement('td');
        td2.textContent = votos[key].insecto;
        const td3 = document.createElement('td');
        td3.textContent = votos[key].votos;

        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        resultadosTable.appendChild(row);
    }
};

// Función para manejar el formulario de suscripción
let ready = () => {
    console.log('DOM está listo');
    // Mostrar los resultados al cargar la página
    actualizarResultados();
}

let loaded = () => {
    let myform = document.getElementById('form');
    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault(); 

        const emailElement = document.querySelector('.form-control-lg');
        const emailText = emailElement.value;
      
        if (emailText.length === 0) {
            emailElement.animate(); // Asegúrate de agregar una animación válida
            emailElement.focus();
            return;
        }
    });

    // Manejar el formulario de votación
    let votacionForm = document.getElementById('votation-form');
    votacionForm.addEventListener('submit', (eventVotacion) => {
        eventVotacion.preventDefault(); 

        const seleccion = document.getElementById('insectos').value; // Obtener el valor seleccionado

        if (seleccion !== "0") {
            // Aumentar los votos para el insecto seleccionado
            votos[seleccion].votos += 1;

            // Actualizar la tabla con los resultados
            actualizarResultados();

            // Resetear el formulario
            document.getElementById('votation-form').reset();
        } else {
            alert("Por favor, selecciona un insecto antes de votar.");
        }
    });
}

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded);
