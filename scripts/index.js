window.addEventListener('load', () => {
    const form = document.forms[0]
    const email = document.getElementById('inputEmail')
    const password = document.getElementById('inputPassword')

    const baseUrl = 'https://ctd-todo-api.herokuapp.com/v1/'

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        
        if(validateNotEmpty(email.value) && validateNotEmpty(password.value)) {
            const userData = normalizeLoginData(email.value, password.value)
            console.log(userData)
            form.reset()
            fetchApiLogin(`${baseUrl}users/login`, userData)
        } else {
            alert('Alguno de los campos está vacío')
        }
    })
})


//-------------------------- Validation --------------------------//

function validateNotEmpty(field) {
    if(field) return true
    else return false
}


//------------------------ Normalization -------------------------//

function normalizeLoginData(email, password) {
    const user = {
        email: email.toLowerCase().trim(),
        password: password.trim()
    }

    return user
}


//--------------------- Post request: Login ----------------------//

function fetchApiLogin(url, payload) {
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
        
        if(data.jwt) {
            localStorage.setItem('token', data.jwt)
            location.href = 'mis-tareas.html'
        }
    })
    .catch(error => console.log(error))
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