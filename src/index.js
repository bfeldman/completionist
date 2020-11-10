const baseUrl = "http://localhost:3000/api/v1"

// fetch(`${baseUrl}/users/12`)
// .then(response => response.json())
// .then(data => console.log(data))

// NEW TASK FORM
// const newTaskForm = document.querySelector("#new-task-form")
// const newTaskTitle = newTaskForm.querySelector("input[name='title']")
// const newTaskDueDate = newTaskForm.querySelector("input[name='due-date']")
// const newTaskPriority = newTaskForm.querySelector("select[name='priority']")
// const newTaskTag = newTaskForm.querySelector("input[name='tag']")
// const newTaskDescription = newTaskForm.querySelector("input[name='description']")

// newTaskForm.addEventListener("submit", (event) => {
//     event.preventDefault()
//     console.log("Task:", newTaskTitle.value)
//     console.log("Due date:", newTaskDueDate.value)
//     console.log("Priority:", newTaskPriority.value)
//     console.log("Tag:", newTaskTag.value)
//     console.log("Description:", newTaskDescription.value)

//     const newTask = {
//         title: newTaskTitle.value,
//         priority_level: newTaskPriority.value, 
//         due_date: newTaskDueDate.value,
//         tag: newTaskTag.value, 
//         description: newTaskDescription.value, 
//         completion_status: false,
//         user_id: 12
//     }

//     fetch(baseUrl+'/tasks', {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         },
//         body: JSON.stringify(newTask)
//     })
//     .then(resp => resp.json())
//     .then(data => console.log(data))
// })

// newTaskForm.addEventListener("submit", (event) => {
//     event.preventDefault()
//     console.log("Task:", newTaskTitle.value)
//     console.log("Due date:", newTaskDueDate.value)
//     console.log("Priority:", newTaskPriority.value)
//     console.log("Tag:", newTaskTag.value)
//     console.log("Description:", newTaskDescription.value)

//     const newTask = {
//         title: newTaskTitle.value,
//         priority_level: newTaskPriority.value, 
//         due_date: newTaskDueDate.value,
//         tag: newTaskTag.value, 
//         description: newTaskDescription.value, 
//         completion_status: true,
//         user_id: 12
//     }

//     fetch(baseUrl+'/tasks/53', {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         }
//     })
//     .then(resp => resp.json())
//     .then(data => console.log(data))
// })



//************ html elements ************//
const mainContainer = document.querySelector('#main-container')
const tasksContainer = document.querySelector('#tasks-container')
const tasksContainerUl = tasksContainer.querySelector('ul')
const taskDetailsDiv = document.querySelector('#task-details')

//************ render functions ************//

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

function renderTasks(userId) {
    fetch(`${baseUrl}/users/${userId}`)
    .then(response => response.json())
    .then(user => {
        user.tasks.forEach(task =>{
            renderTask(task)
        })
    })
}

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

    taskDetailsDiv.append(taskVisibilityButton, detailsTitle, completionButton, detailsDescription, detailsTag, detailsDueDate, detailsPriority, detailsSubtasksUl, deleteButton)

    taskDetailsDiv.style.display = 'block'

}

function getTask(taskId) {
    fetch(`${baseUrl}/tasks/${taskId}`)
    .then(resp => resp.json())
    .then(task => {
        renderTaskDetails(task)
    })
}

function toggleTaskDetailsVisibility(e) {
    e.target.parentElement.style.display = 'none'
    e.target.parentElement.innerHTML = ''
}

//************ init ************//
function init() {
    renderTasks(12)
} 

init()