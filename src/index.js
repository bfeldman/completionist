const baseUrl = "http://localhost:3000/api/v1"

// test fetch
// fetch(`${baseUrl}/users/12`)
// .then(response => response.json())
// .then(data => console.log(data))

/* HTML ELEMENTS */
// login form
const loginForm = document.querySelector("#login")

// main interface
const mainElement = document.querySelector("main")
const mainContainer = document.querySelector("#main-container")


/* FUNCTIONS */ 

// login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const submittedUsername = loginForm.firstElementChild.value
    
    fetch(`${baseUrl}/users`)
    .then(response => response.json())
    .then(data => {
        const user = data.find(u => u.username === submittedUsername)
        if (user) {
            mainElement.style.visibility = "visible"
            mainContainer.dataset.id = user.id
            loginForm.remove()
        }   
    })    
})


// new task form render
const newTaskButton = document.querySelector("#new-task-button")
newTaskButton.addEventListener("click", () => {
    if (!newTaskForm) {
        const taskForm = document.createElement("form")
            taskForm.id = "new-task-form"
        taskForm.innerHTML = `
            <button id="close-form" type="button">X</button>
            <h4>Add Task</h4>
            <input type="text" name="title" placeholder="task"/><br>
            <label>Due date:</label><input type="datetime-local" name="due-date"><br>
            <label>Priority:</label><select name="priority">
                  <option value="2">High</option>
                  <option value="1">Normal</option>
                  <option value="0">Low</option>
            </select><br>
            <label>Tag:</label><input type="text" name="tag" placeholder="tag"/><br>
            <label>Description:</label><input type="text" name="description" placeholder="description"/><br>
            
            <input type="submit" value="Add Task" />
        `
        mainContainer.append(taskForm)
    }
})

//new task form submit
const newTaskForm = document.querySelector("#new-task-form")
newTaskForm.addEventListener("submit", (event) => {
    // get HTML form elements
    const newTaskTitle = newTaskForm.querySelector("input[name='title']")
    const newTaskDueDate = newTaskForm.querySelector("input[name='due-date']")
    const newTaskPriority = newTaskForm.querySelector("select[name='priority']")
    const newTaskTag = newTaskForm.querySelector("input[name='tag']")
    const newTaskDescription = newTaskForm.querySelector("input[name='description']")
    
    event.preventDefault()

    const newTask = {
        title: newTaskTitle.value,
        priority_level: newTaskPriority.value, 
        due_date: newTaskDueDate.value,
        tag: newTaskTag.value, 
        description: newTaskDescription.value, 
        completion_status: false,
        user_id: mainContainer.dataset.id
    }

    fetch(baseUrl+'/tasks', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newTask)
    })
    .then(resp => resp.json())
    .then(data => console.log(data))
})