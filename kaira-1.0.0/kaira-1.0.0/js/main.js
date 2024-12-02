let ready = () => {
    console.log('DOM está listo')
    
}

let loaded = () => {

    let myform = document.getElementById('form');
    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault(); 

        const emailElement = document.querySelector('.form-control-lg');
    const emailText = emailElement.value;
  
      if (emailText.length === 0) {
          emailElement.animate()
          emailElement.focus();

          return
      }
  

    })


window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded)
}
