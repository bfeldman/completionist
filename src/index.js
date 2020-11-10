const baseUrl = "http://localhost:3000/api/v1"

/* HTML ELEMENTS */
// login form
const loginForm = document.querySelector("#login")

// main interface
const mainElement = document.querySelector("main")
const mainContainer = document.querySelector("#main-container")
const newTaskButton = document.querySelector("#new-task-button")
const tasksContainerDiv = document.querySelector("#tasks-container")
const tasksContainerUl = tasksContainerDiv.querySelector("ul")
const taskDetailsDiv = document.querySelector("#task-details")

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
            renderTasks(user.id)
        }   
    })    
})


// task form render
newTaskButton.addEventListener("click", () => {
    taskFormRender({}, "POST")
})

function taskFormRender(task, action) {
    if (!document.querySelector("#task-form")) {
        const taskForm = document.createElement("form")
            taskForm.id = "task-form"

        const closeFormButton = document.createElement("button")
            closeFormButton.id = "close-form"
            closeFormButton.setAttribute("type", "button")
            closeFormButton.textContent = "❌ Close Form"
        
        const taskFormHeader = document.createElement("h4")
            if (task.title) {
                taskFormHeader.textContent = "Edit Task"
            } else {
                taskFormHeader.textContent = "Add Task"
            }
        
        const taskTitleInput = document.createElement("input")
            taskTitleInput.setAttribute("type", "text")
            taskTitleInput.setAttribute("name", "title")
            taskTitleInput.setAttribute("placeholder", "task title")
            if (task.title) {
                taskTitleInput.value = task.title
            }
        
        const taskDueDateLabel = document.createElement("label")
            taskDueDateLabel.textContent = "Due date:"
        const taskDueDateSelect = document.createElement("input")
            taskDueDateSelect.setAttribute("type", "datetime-local")
            taskDueDateSelect.setAttribute("name", "due-date")
            if (task.due_date) {
                taskDueDateSelect.setAttribute("value", task.due_date.slice(0, -8))
            }
        
        const taskPriorityLabel = document.createElement("label")
            taskPriorityLabel.textContent = "Priority:"
        const taskPrioritySelect = document.createElement("select")
            taskPrioritySelect.setAttribute("name", "priority")
            const highPriority = document.createElement("option")
                highPriority.setAttribute("value", "2")
                highPriority.textContent = "High"
            const normalPriority = document.createElement("option")
                normalPriority.setAttribute("value", "1")
                normalPriority.textContent = "Normal"
            const lowPriority = document.createElement("option")
                lowPriority.setAttribute("value", "0")
                lowPriority.textContent = "Low"
            taskPrioritySelect.append(highPriority, normalPriority, lowPriority)
            if (task.priority_level) {
                taskPrioritySelect.value = task.priority_level
            }
            
        const taskTagLabel = document.createElement("label")
            taskTagLabel.textContent="Tag:"
        const taskTagInput = document.createElement("input")
            taskTagInput.setAttribute("type", "text")
            taskTagInput.setAttribute("name", "tag")
            if (task.tag) {
                taskTagInput.value = task.tag
            }
            
        const taskDescriptionLabel = document.createElement("label")
            taskDescriptionLabel.textContent="Description:"
        const taskDescriptionInput = document.createElement("input")
            taskDescriptionInput.setAttribute("type", "text")
            taskDescriptionInput.setAttribute("name", "description")
            if (task.description) {
                taskDescriptionInput.value = task.description
            }
            
        const submitTaskButton = document.createElement("input")
            submitTaskButton.setAttribute("type", "submit")
            if (action === "POST") {
                submitTaskButton.setAttribute("value", "Add New Task")
            } else if (action === "PATCH") {
                submitTaskButton.setAttribute("value", "Update Task")
            }

        taskDetailsDiv.innerHTML = ''
        taskDetailsDiv.style.display = 'block'

        taskForm.append(
            closeFormButton,
            taskFormHeader,
            taskTitleInput,
            document.createElement("br"),
            taskDueDateLabel,
            taskDueDateSelect,
            document.createElement("br"),
            taskPriorityLabel,
            taskPrioritySelect,
            document.createElement("br"),
            taskTagLabel,
            taskTagInput,
            document.createElement("br"),
            taskDescriptionLabel,
            taskDescriptionInput,
            document.createElement("br"),
            submitTaskButton
        )
        taskDetailsDiv.append(taskForm)
        
        //task form submit
        taskForm.addEventListener("submit", (event) => {
            event.preventDefault()
            // get HTML form inputs
            const newTaskTitle = taskForm.querySelector("input[name='title']").value
            const newTaskDueDate = taskForm.querySelector("input[name='due-date']").value
            const newTaskPriority = taskForm.querySelector("select[name='priority']").value
            const newTaskTag = taskForm.querySelector("input[name='tag']").value
            const newTaskDescription = taskForm.querySelector("input[name='description']").value
        
            let newTask = {
                title: newTaskTitle,
                priority_level: newTaskPriority, 
                due_date: newTaskDueDate,
                tag: newTaskTag, 
                description: newTaskDescription, 
                completion_status: false,
                user_id: mainContainer.dataset.id
            }
            
            if (action === "POST") {
                postNewTask(newTask)
            } else if (action === "PATCH") {
                editTask(newTask, task.id)
            }
        })
        
        // close task form
        const closeFormBtn = taskForm.querySelector("#close-form")
        closeFormBtn.addEventListener("click", () => {
            taskDetailsDiv.innerHTML = ''
            taskDetailsDiv.style.display = 'none'
        })
    }
}

// render single tasks
function renderTask(task) {
    const taskCardLi = document.createElement('li')

    const taskCardDiv = document.createElement('div')
    taskCardDiv.dataset.id = task.id
    taskCardDiv.className = 'task-card'

    const taskTitle = document.createElement('h5')
    taskTitle.textContent = task.title

    const taskDueDate = document.createElement('p')
    const [year, month, day] = task.due_date.split('T').slice(0,1).join('-').split('-')
    taskDueDate.textContent = `Due: ${month}/${day}/${year}`

    const taskPriority = document.createElement('p')
    taskPriority.textContent = `Priority: ${task.priority_level}`

    const completionButton = document.createElement('button')
    if (task.completion_status) {
        completionButton.textContent = 'complete'
    } else {
        completionButton.textContent = 'incomplete'
    }

    taskCardDiv.append(taskTitle, taskDueDate, taskPriority, completionButton)

    taskCardLi.append(taskCardDiv)

    tasksContainerUl.append(taskCardLi)

    taskCardDiv.addEventListener('click', (e) => {
        getTask(e.target.dataset.id)
    })
}

// render all tasks
function renderTasks(userId) {
    fetch(`${baseUrl}/users/${userId}`)
    .then(response => response.json())
    .then(user => {
        user.tasks.forEach(task =>{
            renderTask(task)
        })
    })
}

// render task details
function renderTaskDetails(task) {

    taskDetailsDiv.innerHTML = ''

    const taskVisibilityButton = document.createElement('button')
    taskVisibilityButton.addEventListener('click', toggleTaskDetailsVisibility)
    taskVisibilityButton.textContent = 'X'

    const detailsTitle = document.createElement('h3')
    detailsTitle.textContent = task.title
    detailsTitle.id = 'task-detail-title'

    const detailsDescription = document.createElement('p')
    detailsDescription.textContent = `Notes: ${task.description}`
    detailsDescription.id = 'task-detail-description'

    const detailsTag = document.createElement('p')
    detailsTag.textContent = `Tag: ${task.tag}`
    detailsTag.id = 'task-detail-tag'

    const detailsDueDate = document.createElement('p')
    const [year, month, day] = task.due_date.split('T').slice(0,1).join('-').split('-')
    detailsDueDate.textContent = `Due: ${month}/${day}/${year}`
    detailsDueDate.id = 'task-detail-due-date'
    
    const detailsPriority = document.createElement('p')
    detailsPriority.textContent = `Priority: ${task.priority_level}`
    detailsPriority.id = 'task-detail-priority'

    const completionButton = document.createElement('button')
    if (task.completion_status) {
        completionButton.textContent = 'complete'
    } else {
        completionButton.textContent = 'incomplete'
    }

    const detailsSubtasksUl = document.createElement('ul')
    detailsSubtasksUl.id = 'subtask-list'

    task.subtasks.forEach(subtask => {
        const subtaskLi = document.createElement('li')
        subtaskLi.dataset.id = subtask.id
        subtaskLi.textContent = subtask.title
        detailsSubtasksUl.append(subtaskLi)
    })

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete Task'
    
    const editButton = document.createElement('button')
    editButton.textContent = 'Edit Task'
    editButton.addEventListener("click", () => {
        taskFormRender(task, "PATCH")
    })

    taskDetailsDiv.append(taskVisibilityButton, detailsTitle, completionButton, detailsDescription, detailsTag, detailsDueDate, detailsPriority, detailsSubtasksUl, deleteButton, editButton)

    taskDetailsDiv.style.display = 'block'
}

// get single task
function getTask(taskId) {
    fetch(`${baseUrl}/tasks/${taskId}`)
    .then(resp => resp.json())
    .then(task => {
        renderTaskDetails(task)
    })
}

// event handler for task detail visbility
function toggleTaskDetailsVisibility(e) {
    e.target.parentElement.style.display = 'none'
    e.target.parentElement.innerHTML = ''
}

// persist new task to db
function postNewTask(task) {
    fetch(baseUrl+'/tasks', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(task)
    })
    .then(resp => resp.json())
    .then(task => {
        renderTask(task)
        renderTaskDetails(task)
    })
}

// persist edited task to db
function editTask(task, id) {
    fetch(`${baseUrl}/tasks/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(task)
    })
    .then(resp => resp.json())
    .then(task => {
        renderTaskDetails(task)
        updateCard(task)
    })
}

// update card after editing task
function updateCard(task) {
    const taskCard = document.querySelector(`.task-card[data-id="${task.id}"]`).childNodes
    taskCard[0].textContent = task.title
    const [year, month, day] = task.due_date.split('T').slice(0,1).join('-').split('-')
    taskCard[1].textContent = `Due: ${month}/${day}/${year}`
    taskCard[2].textContent = `Priority: ${task.priority_level}`
}