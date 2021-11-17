window.addEventListener('load', () => {
    const usernameElement = document.querySelector('.user-info p')

    const token = localStorage.getItem('token')

    const baseUrl = 'https://ctd-todo-api.herokuapp.com/v1/'
    
    fetchGetInfo(`${baseUrl}users/getMe`, token)
    fetchGetTasks(`${baseUrl}tasks`, token)
    
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
