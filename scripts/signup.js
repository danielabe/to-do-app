window.addEventListener('load', () => {
    const form = document.getElementById('elform')
    const name = document.getElementById('inputName')
    const lastName = document.getElementById('inputLastName')
    const email = document.getElementById('inputEmail')
    const password = document.getElementById('inputPassword')
    const repeatPassword = document.getElementById('inputRepeatPassword')

    const baseUrl = 'https://ctd-todo-api.herokuapp.com/v1/';

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        if(validateNotEmpty(name.value) && validateNotEmpty(lastName.value) && validateNotEmpty(email.value) && 
        validateNotEmpty(password.value) && validateNotEmpty(repeatPassword.value) && validateBothPasswords(password.value, repeatPassword.value)) {
            const userData = normalizeRegisterData(name.value, lastName.value, email.value, password.value)
            console.log(userData)
            form.reset()
            fetchApiRegister(`${baseUrl}users`, userData)
        } else {
            alert('Alguno de los campos no es correcto')
        }

        
    })
})

//-------------------------- Validation --------------------------//

function validateNotEmpty(field) {
    if(field) return true
    else return false
}

function validateBothPasswords(pass1, pass2) {
    return pass1 == pass2
}


//------------------------ Normalization -------------------------//

function normalizeRegisterData(name, lastName, email, password) {
    const user = {
        firstName: name.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: password.trim()
    }

    return user
}


//-------------------- Post request: Register --------------------//

function fetchApiRegister(url, payload) {
    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    fetch(url, settings)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        
        if(data.jwt) {
            localStorage.setItem('token', data.jwt)
            location.href = 'mis-tareas.html'
        }
    })
    .catch(error => console.log(error))
}

