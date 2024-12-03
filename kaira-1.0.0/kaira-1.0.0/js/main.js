const databaseURL = 'https://new-landing-page-1c364-default-rtdb.firebaseio.com/collection.json';

let sendData = () => {
    let form = document.getElementById('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

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
            alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces'); // Maneja la respuesta con un mensaje
            form.reset()

            getData();
        })
        .catch(error => {
            alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
        });
}

let getData = async () => {
    try {
        const response = await fetch(databaseURL);

        if (!response.ok) {
            alert('Hemos experimentado un error. ¡Vuelve pronto!');
        }

        const data = await response.json();

        if (data != null) {
            debugger
            let countSuscribers = new Map();
            let countCups = new Map();

            if (Object.keys(data).length > 0) {
                for (let key in data) {
                    let { email, saved, cupsSelect } = data[key];

                    let date = saved.split(",")[0];

                    let countS = countSuscribers.get(date) || 0;
                    let countC = countCups.get(date) || 0;
                    countSuscribers.set(date, countS + 1);
                    countCups.set(date, countC + parseInt(cupsSelect, 10));
                }
            }
            if (countSuscribers.size > 0) {

                subscribers.innerHTML = ''

                for (let date of countCups.keys()) {
                    let rowTemplate = `
                        <tr>
                            <th scope="row">1</th>
                            <td>${date}</td>
                            <td>${countSuscribers.get(date)}</td>
                            <td>${countCups.get(date)}</td>
                        </tr>`
                    subscribers.innerHTML += rowTemplate
                }
            }
        }
    } catch (error) {
        alert('Hemos experimentado un error. ¡Vuelve pronto!');
    }
}

let ready = () => {
    console.log('DOM está listo');
    getData();
}

let loaded = (eventLoaded) => {

    let myform = document.getElementById('form');

    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault();
        const select = document.getElementById('cupsSelect');
        const selection = select.value;
        const emailElement = document.querySelector('.form-control-lg');
        const emailText = emailElement.value;

        if (emailText.length === 0) {
            emailElement.focus();
            emailElement.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(50px)" },
                    { transform: "translateX(-50px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 400,
                    easing: "linear",
                }
            );
            return;
        }else if(selection == 0) {
            select.focus();
            select.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(50px)" },
                    { transform: "translateX(-50px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 400,
                    easing: "linear",
                }
            );
            return;
        }

        sendData();
    });
}

window.addEventListener('DOMContentLoaded', ready);
window.addEventListener('load', loaded);