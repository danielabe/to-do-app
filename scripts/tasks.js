window.addEventListener('load', () => {
    const usernameElement = document.querySelector('.user-info p')
    const form = document.forms[0]
    const newTaskInput = document.getElementById('nuevaTarea')

    const token = localStorage.getItem('token')

    const baseUrl = 'https://ctd-todo-api.herokuapp.com/v1/'
    
    fetchGetInfo(`${baseUrl}users/getMe`, token)
    fetchGetTasks(`${baseUrl}tasks`, token)
    
    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const newTask = {
            description: newTaskInput.value,
            completed: false
        }

        createNewTask(`${baseUrl}tasks`, token, newTask)
    })
    //------------- Get request: Get user infomation --------------//
    
    function fetchGetInfo(url, token) {
        const settings = {
            method: 'GET',
            headers: {
                authorization: token
            }
        }
    
        fetch(url, settings)
        .then(response => response.json())
        .then(data => {
            usernameElement.innerText = data.firstName
        })
        .catch(error => console.log(error))
    }
})


//------------- Get request: Get tasks list --------------//

function fetchGetTasks(url, token) {
    const settings = {
        method: 'GET',
        headers: {
            authorization: token
        }
    }

    fetch(url, settings)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}


//---------- Post request: create a new  task -----------//

function createNewTask(url, token, payload) {
    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: token
        },
        body: JSON.stringify(payload)
    }

    fetch(url, settings)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}