window.addEventListener('load', () => {
    const form = document.getElementById('elform')
    const name = document.getElementById('inputName')
    const lastName = document.getElementById('inputLastName')
    const email = document.getElementById('inputEmail')
    const password = document.getElementById('inputPassword')
    const repeatPassword = document.getElementById('inputRepeatPassword')
    const msgPasswordError = document.getElementById('msgPasswordError')

    const baseUrl = 'https://ctd-todo-api.herokuapp.com/v1/'

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const nonEmptyFields = validateNotEmpty(name.value) && validateNotEmpty(lastName.value) && validateNotEmpty(email.value) &&
        validateNotEmpty(password.value) && validateNotEmpty(repeatPassword.value)
        const matchingPasswords = validateBothPasswords(password.value, repeatPassword.value)

        if ( nonEmptyFields && matchingPasswords) {
            const userData = normalizeRegisterData(name.value, lastName.value, email.value, password.value)
            console.log(userData)
            fetchApiRegister(`${baseUrl}users`, userData)
        } 
        if(!nonEmptyFields) {
            showEmptyFields()
            registrationError('Alguno de los campos no es correcto.')
        } 
        if (!matchingPasswords) { 
            showPasswordError()
            registrationError('Alguno de los campos no es correcto.')
        }
    })
    
    
    //------------------------- Wrong fields --------------------------//
    
    function showEmptyFields() {
        document.querySelectorAll('input:not([type=submit])').forEach(input => {
            if (!validateNotEmpty(input.value)) {
                input.classList.add('wrong-field')
                input.nextElementSibling.classList.remove('none')
            }
            removeErrorMessageEmptyFields(input)
            
        })
    }
    
    function removeErrorMessageEmptyFields(element) {
        element.addEventListener('change', () => {
            element.classList.remove('wrong-field')
            element.nextElementSibling.classList.add('none')
        })
    }
    
    function showPasswordError() {
        repeatPassword.classList.add('wrong-field')
        msgPasswordError.classList.remove('none')
        removeErrorMessagePassword()
    }
    
    function removeErrorMessagePassword() {
        msgPasswordError.parentNode.addEventListener('change', () => {
            msgPasswordError.classList.add('none')
            repeatPassword.classList.remove('wrong-field')
        })
        password.addEventListener('change', () => {
            msgPasswordError.classList.add('none')
            repeatPassword.classList.remove('wrong-field')
        })
    }
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
        .then(response => {
            hideSpinner()
            return response.json()
        })
        .then(data => {
            console.log(data)
            registrationError(data)

            if (data.jwt) {
                localStorage.setItem('token', data.jwt)
                location.href = 'mis-tareas.html'
            }
        })
        .catch(error => {
            console.log(error)
            
        })
}


//---------------------- Registration error -----------------------//

function registrationError(text) {
    Swal.fire({
        title: 'Error de registro',
        text: text,
        icon: 'error',
        confirmButtonText: 'Ok'
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