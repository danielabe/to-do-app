window.addEventListener('load', () => {
    const usernameElement = document.querySelector('.user-info p')
    const form = document.forms[0]
    const newTaskInput = document.getElementById('nuevaTarea')
    const completedTasks = document.querySelector('.tareas-terminadas')
    const pendingTasks = document.querySelector('.tareas-pendientes')
    const closeApp = document.getElementById('closeApp')

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
        form.reset()
    })

    closeApp.addEventListener('click', () => logOut())

    
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
    
    //---------------- Get request: Get tasks list ----------------//
    
    function fetchGetTasks(url, token) {
        const settings = {
            method: 'GET',
            headers: {
                authorization: token
            }
        }
    
        fetch(url, settings)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                renderTasks(data)
            })
            .catch(error => console.log(error))
    }
    
    
    //------------- Post request: create a new  task --------------//
    
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
            .then(data => {
                console.log(data)
                fetchGetTasks(url, token)
            })
            .catch(error => console.log(error))
    }
    
    
    //--------------------- Render tasks list ---------------------//
    
    function renderTasks(list) {
        completedTasks.innerText = ''
        pendingTasks.innerText = ''
        list.forEach(task => {
            if (task.completed) {
                completedTasks.innerHTML += `<li class="tarea">
                                                <div class="done"></div>
                                                <div class="descripcion">
                                                    <p class="nombre">${task.description}</p>
                                                    <div>
                                                        <button><i id="${task.id}" class="fas fa-undo-alt change"></i></button>
                                                        <button><i id="${task.id}" class="far fa-trash-alt"></i></button>
                                                    </div>
                                                </div>
                                            </li>`
            } else {
                pendingTasks.innerHTML +=   `<li class="tarea">
                                                <div class="not-done change" id="${task.id}"></div>
                                                <div class="descripcion">
                                                    <p class="nombre">${task.description}</p>
                                                    <p class="timestamp"><i class="far fa-calendar-alt"></i> ${task.createdAt}</p>
                                                </div>
                                            </li>`
            }
        })
    }

    //-------------------------- Log out --------------------------//
    
    function logOut() {
        localStorage.removeItem('token')
        location.href = 'index.html'
    }
})

