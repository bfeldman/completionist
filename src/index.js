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


// new task form render
newTaskButton.addEventListener("click", () => {
    if (!document.querySelector("#new-task-form")) {
        const taskForm = document.createElement("form")
            taskForm.id = "new-task-form"

        const closeFormButton = document.createElement("button")
            closeFormButton.id = "close-form"
            closeFormButton.setAttribute("type", "button")
            closeFormButton.textContent = "❌ Close Form"
        
        const taskFormHeader = document.createElement("h4")
            taskFormHeader.textContent = "Add Task"
        
        const taskTitleInput = document.createElement("input")
            taskTitleInput.setAttribute("type", "text")
            taskTitleInput.setAttribute("name", "title")
            taskTitleInput.setAttribute("placeholder", "task title")
            taskTitleInput.append(document.createElement("br"))
        
        const taskDueDateLabel = document.createElement("label")
            taskDueDateLabel.textContent = "Due date:"
        const taskDueDateSelect = document.createElement("input")
            taskDueDateSelect.setAttribute("type", "datetime-local")
            taskDueDateSelect.setAttribute("name", "due-date")
            taskDueDateSelect.append(document.createElement("br"))
        
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
        
        const taskTagLabel = document.createElement("label")
            taskTagLabel.textContent="Tag:"
        const taskTagInput = document.createElement("input")
            taskTagInput.setAttribute("type", "text")
            taskTagInput.setAttribute("name", "tag")
            
        const taskDescriptionLabel = document.createElement("label")
            taskDescriptionLabel.textContent="Description:"
        const taskDescriptionInput = document.createElement("input")
            taskDescriptionInput.setAttribute("type", "text")
            taskDescriptionInput.setAttribute("name", "description")
            
        const submitNewTaskButton = document.createElement("input")
            submitNewTaskButton.setAttribute("type", "submit")
            submitNewTaskButton.setAttribute("value", "Add New Task")

        taskDetailsDiv.innerHTML = ''
        taskDetailsDiv.style.display = 'flex'

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
            submitNewTaskButton
        )
        taskDetailsDiv.append(taskForm)
        
        //new task form submit
        taskForm.addEventListener("submit", (event) => {
            event.preventDefault()
            // get HTML form inputs
            const newTaskTitle = newTaskForm.querySelector("input[name='title']").value
            const newTaskDueDate = newTaskForm.querySelector("input[name='due-date']").value
            const newTaskPriority = newTaskForm.querySelector("select[name='priority']").value
            const newTaskTag = newTaskForm.querySelector("input[name='tag']").value
            const newTaskDescription = newTaskForm.querySelector("input[name='description']").value
        
            const newTask = {
                title: newTaskTitle,
                priority_level: newTaskPriority, 
                due_date: newTaskDueDate,
                tag: newTaskTag, 
                description: newTaskDescription, 
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
            .then(task => {
                newTaskForm.remove()
                renderTask(task)
            })
        })
        
        // close new task form
        const closeFormBtn = taskForm.querySelector("#close-form")
        closeFormBtn.addEventListener("click", () => {
            taskDetailsDiv.innerHTML = ''
            taskDetailsDiv.style.display = 'none'
        })
    }
})

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
        if (e.target.dataset.id) {
            getTask(e.target.dataset.id)
        } else {
            getTask(e.target.parentElement.dataset.id)
        }
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

    const taskDetailsContainerDiv = document.createElement('div')
    taskDetailsContainerDiv.id = 'task-details-container'

    const taskVisibilityButton = document.createElement('button')
    taskVisibilityButton.addEventListener('click', toggleTaskDetailsVisibility)
    taskVisibilityButton.textContent = '❌ Close Task Details'

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

    const detailsSubtaskHeader = document.createElement('h4')
    detailsSubtaskHeader.textContent = "Subtasks:"

    const detailsSubtaskAddButton = document.createElement('button')
    detailsSubtaskAddButton.id = 'subtask-add-button'
    detailsSubtaskAddButton.textContent = "Add Subtask"
    detailsSubtaskAddButton.addEventListener('click', showAddSubtask)

    const addSubtaskForm = document.createElement("form")
    addSubtaskForm.id = 'subtask-add-form'

    const subtaskTitleInput = document.createElement("input")
    subtaskTitleInput.setAttribute("type", "text")
    subtaskTitleInput.setAttribute("name", "title")

    addSubtaskForm.append(subtaskTitleInput)
    addSubtaskForm.addEventListener('submit', (e) => {
        addSubtask(task, e)
    })

    task.subtasks.forEach(subtask => {
        const subtaskLi = document.createElement('li')
        subtaskLi.dataset.id = subtask.id
        const subtaskCheckbox = document.createElement('input')
        subtaskCheckbox.dataset.id = subtask.id
        subtaskCheckbox.type = 'checkbox'
        if (subtask.completion_status) {
            subtaskCheckbox.checked = true
        }
        subtaskCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                const newStatus = true
                updateSubtaskCompletionStatus(newStatus, subtask)
            } else {
                const newStatus = false
                updateSubtaskCompletionStatus(newStatus, subtask)
            }
        })
        subtaskLi.textContent = `${subtask.title} `
        subtaskLi.prepend(subtaskCheckbox)
        const subtaskDeleteButton = document.createElement('button')
        subtaskDeleteButton.dataset.id = subtask.id
        subtaskDeleteButton.textContent = 'x'
        subtaskDeleteButton.addEventListener('click', (e) => {
            deleteSubtask(task, subtask, e)
        })
        subtaskLi.append(subtaskDeleteButton)
        detailsSubtasksUl.append(subtaskLi)
    })

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete Task'

    taskDetailsContainerDiv.append(taskVisibilityButton, detailsTitle, completionButton, detailsDescription, detailsTag, detailsDueDate, detailsPriority, detailsSubtaskHeader, detailsSubtaskAddButton, addSubtaskForm, detailsSubtasksUl, deleteButton)

    taskDetailsDiv.append(taskDetailsContainerDiv)

    taskDetailsDiv.style.display = 'flex'
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
    e.target.parentElement.parentElement.style.display = 'none'
    e.target.parentElement.parentElement.innerHTML = ''
}

// event handler for subtask check
function updateSubtaskCompletionStatus(newStatus, subtask) {
    fetch(`${baseUrl}/subtasks/${subtask.id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            title: subtask.title,
            completion_status: newStatus,
            task_id: subtask.task_id
        })
    })
    .then(resp => resp.json())
    .then(subtask => {
        console.log(subtask)
    })
}

// event handler for subtask delete
function deleteSubtask(task, subtask, e) {
    // e.target.parentElement.remove()
    fetch(`${baseUrl}/subtasks/${subtask.id}`, {method: 'DELETE'})
    .then(resp => resp.json())
    .then(subtask => {
        console.log("success!", subtask)
        getTask(task.id)
    })
}

// event handler for adding subtask
function showAddSubtask() {
    const addSubtaskForm = document.querySelector('#subtask-add-form')
    addSubtaskForm.style.display = 'block'
}

function addSubtask(task, e) {
    e.preventDefault()
    const addSubtaskForm = document.querySelector('#subtask-add-form')
    addSubtaskForm.style.display = 'none'
    fetch(`${baseUrl}/subtasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            title: e.target.title.value,
            completion_status: false,
            task_id: task.id
        })
    })
    .then(resp => resp.json())
    .then(subtask => {
        console.log(subtask)
        getTask(task.id)
    })
}