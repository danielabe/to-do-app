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
            .then(data => usernameElement.innerText = data.firstName)
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
            .then(data => renderTasks(data))
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
            .then(response => fetchGetTasks(url, token))
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
                pendingTasks.innerHTML += `<li class="tarea">
                                                <div class="not-done change" id="${task.id}"></div>
                                                <div class="descripcion">
                                                    <p class="nombre">${task.description}</p>
                                                    <p class="timestamp"><i class="far fa-calendar-alt"></i> ${dayjs(task.createdAt).format('MM/DD/YYYY H:mm')}</p>
                                                </div>
                                            </li>`
            }
        })
        changeStatus()
        deleteTask()
    }

    //-------------------------- Log out --------------------------//

    function logOut() {
        Swal.fire({
            title: '¿Deseas cerrar sesión?',
            text: "Luego, para volver a ingresar deberá colocar sus credenciales.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Cerrar sesión',
            cancelButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token')
                location.href = 'index.html'
            }
        })
    }


    //-------------------- Change task status ---------------------//

    function changeStatus() {
        const changeBtn = document.querySelectorAll('.change')
        changeBtn.forEach(task => {
            task.addEventListener('click', (e) => {
                const id = e.target.id
                const payload = {}

                if (e.target.classList.contains('not-done')) {
                    payload.completed = true
                } else {
                    payload.completed = false
                }
                updateTask(baseUrl, id, token, payload)
            })
        })
    }


    //---------------- Put request: update a task -----------------//

    function updateTask(url, id, token, payload) {
        const settings = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: token
            },
            body: JSON.stringify(payload)
        }

        fetch(`${url}tasks/${id}`, settings)
            .then(response => fetchGetTasks(`${url}tasks`, token))
            .catch(error => console.log(error))
    }


    //--------------- Delete request: delete a task ---------------//

    function deleteTask() {
        const deleteBtn = document.querySelectorAll('.fa-trash-alt')
        deleteBtn.forEach(task => {
            task.addEventListener('click', (e) => {
                console.log(e.target.id)
                const id = e.target.id

                const settings = {
                    method: 'DELETE',
                    headers: {
                        authorization: token
                    }
                }

                Swal.fire({
                    title: '¿Deseas eliminar esta tarea definitivamente?',
                    text: "Esta acción no se podrá revertir.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Eliminar',
                    cancelButtonText: `Cancelar`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        fetch(`${baseUrl}tasks/${id}`, settings)
                            .then(response => fetchGetTasks(`${baseUrl}tasks`, token))
                            .catch(error => console.log(error))

                        Swal.fire(
                            'Tarea eliminada!',
                            'La tarea ha sido eliminada de forma permanente.',
                            'success'
                        )
                    }
                })


            })
        })
    }
})

