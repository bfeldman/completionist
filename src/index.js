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

//************ render functions ************//

function renderTask(task) {
    const taskCardLi = document.createElement('li')

    const taskCardDiv = document.createElement('div')
    taskCardDiv.dataset.id = task.id
    taskCardDiv.className = 'task-card'

    const taskTitle = document.createElement('h5')
    taskTitle.textContent = task.title

    const taskDueDate = document.createElement('p')
    taskDueDate.textContent = `Due: ${task.due_date.replace('T00:00:00.000Z','')}`

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
        console.log(e.target)
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
    
    const detailsDiv = document.createElement('div')
    detailsDiv.id = 'task-details'

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
    detailsDueDate.textContent = `Due: ${task.due_date.replace('T00:00:00.000Z','')}`
    detailsDueDate.id = 'task-detail-due-date'

    const detailsPriority = document.createElement('p')
    detailsPriority.textContent = `Priority: ${task.priority_level}`
    detailsPriority.id = 'task-detail-priority'

    const detailsSubtasksUl = document.createElement('ul')
    detailsSubtasksUl.id = 'subtask-list'

    task.subtasks.forEach(subtask => {
        const subtaskLi = document.createElement('li')
        subtaskLi.dataset.id = subtask.id
        subtaskLi.textContent = subtask.title
        detailsSubtasksUl.append(subtaskLi)
    })

    detailsDiv.append(detailsTitle, detailsDescription, detailsTag, detailsDueDate, detailsPriority, detailsSubtasksUl)

    mainContainer.append(detailsDiv)

}

function getTask(taskId) {
    fetch(`${baseUrl}/tasks/${taskId}`)
    .then(resp => resp.json())
    .then(task => {
        renderTaskDetails(task)
    })
}

//************ init ************//
function init() {
    renderTasks(12)
} 

init()