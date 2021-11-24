window.addEventListener('load', () => {
    const form = document.getElementById('elform')
    const name = document.getElementById('inputName')
    const lastName = document.getElementById('inputLastName')
    const email = document.getElementById('inputEmail')
    const password = document.getElementById('inputPassword')
    const repeatPassword = document.getElementById('inputRepeatPassword')

    const baseUrl = 'https://ctd-todo-api.herokuapp.com/v1/'

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        if (validateNotEmpty(name.value) && validateNotEmpty(lastName.value) && validateNotEmpty(email.value) &&
            validateNotEmpty(password.value) && validateNotEmpty(repeatPassword.value) && validateBothPasswords(password.value, repeatPassword.value)) {
            const userData = normalizeRegisterData(name.value, lastName.value, email.value, password.value)
            console.log(userData)
            form.reset()
            fetchApiRegister(`${baseUrl}users`, userData)
        } else {
            showWrongFields()
            registrationError()
        }


    })
})

//-------------------------- Validation --------------------------//

function validateNotEmpty(field) {
    if (field) return true
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
    showSpinner()
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
            hideSpinner()
            console.log(data)

            if (data.jwt) {
                localStorage.setItem('token', data.jwt)
                location.href = 'mis-tareas.html'
            }
        })
        .catch(error => console.log(error))
}


//---------------------- Registration error -----------------------//

function registrationError() {
    Swal.fire({
        title: 'Error de registro',
        text: "Alguno de los campos no es correcto.",
        icon: 'error',
        confirmButtonText: 'Ok'
    })
}


//------------------------- Wrong fields --------------------------//

function showWrongFields() {
    document.querySelectorAll('input:not([type=submit])').forEach(input => {
        if (!validateNotEmpty(input.value)) {
            input.classList.add('wrong-field')
            input.nextElementSibling.classList.remove('none')
            /* input.insertAdjacentHTML("afterend", '<small class="error">*Campo obligatorio</small>') */
        }
        removeErrorMessage(input)
        
    })
}


function removeErrorMessage(element) {
    element.addEventListener('change', () => {
        element.classList.remove('wrong-field')
        element.nextElementSibling.classList.add('none')
    })
}


//---------------------------- Spinner ----------------------------//

function showSpinner() {
    const imgSpinner = document.getElementById('spinner')
    imgSpinner.style.display = 'block'
}

function hideSpinner() {
    const imgSpinner = document.getElementById('spinner')
    imgSpinner.style.display = 'none'
}