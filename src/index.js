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
const taskSortButton = document.querySelector("#sort-button")
const taskFilterButton = document.querySelector("#filter-button")

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
            loginForm.parentElement.remove()
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
                highPriority.setAttribute("value", "High")
                highPriority.textContent = "High"
            const normalPriority = document.createElement("option")
                normalPriority.setAttribute("value", "Normal")
                normalPriority.textContent = "Normal"
            const lowPriority = document.createElement("option")
                lowPriority.setAttribute("value", "Low")
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
    completionButton.addEventListener("click", (e) => {
        taskCompletionToggle(task, task.completion_status)
    })

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
    taskDetailsContainerDiv.dataset.id = task.id
    
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
        completionButton.textContent = 'Complete ✅'
    } else {
        completionButton.textContent = 'Incomplete'
    }
    completionButton.addEventListener("click", (e) => {
        taskCompletionToggle(task, task.completion_status)
    })

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
        subtaskDeleteButton.className = 'delete-indv-subtask-button'
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
    deleteButton.addEventListener("click", (e) => {
        const deletedTaskId = e.target.parentElement.dataset.id
        deleteTask(deletedTaskId)
    })
    
    const editButton = document.createElement('button')
    editButton.textContent = 'Edit Task'
    editButton.addEventListener("click", () => {
        taskFormRender(task, "PATCH")
    })

    taskDetailsContainerDiv.append(taskVisibilityButton, detailsTitle, completionButton, detailsDescription, detailsTag, detailsDueDate, detailsPriority, detailsSubtaskHeader, detailsSubtaskAddButton, addSubtaskForm, detailsSubtasksUl, deleteButton, editButton)

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

//sort event listener
taskSortButton.addEventListener('click', toggleSortSubMenu)

function toggleSortSubMenu() {
    const navSubMenu = document.querySelector("#nav-sub-menu")
    const navSubMenuUl = navSubMenu.querySelector("ul")
    navSubMenuUl.innerHTML = ''
    if (navSubMenuUl.id === 'filter-sub-list' || navSubMenuUl.id === 'nav-sub-menu-ul') {
        navSubMenuUl.id = 'sort-sub-list'
        navSubMenuUl.style.display = 'block'
        const sortByDateLi = document.createElement('li')
        sortByDateLi.textContent = 'sort by date'
        sortByDateLi.addEventListener('click', (e) => {
            sortTasks("due_date")
        })
        const sortByPriorityLi = document.createElement('li')
        sortByPriorityLi.textContent = 'sort by priority'
        sortByPriorityLi.addEventListener('click', (e) => {
            sortTasks("priority_level")
        })
        navSubMenuUl.append(sortByDateLi,sortByPriorityLi)
    } else {
        navSubMenuUl.id = 'nav-sub-menu-ul'
        navSubMenuUl.style.display = 'none'
    }
}

function sortTasks(criteria) {
    fetch(`${baseUrl}/users/${mainContainer.dataset.id}`)
    .then(resp => resp.json())
    .then(user => {        
        const highTasks = user.tasks.filter(task => task.priority_level === "High")
        const normalTasks = user.tasks.filter(task => task.priority_level === "Normal")
        const lowTasks = user.tasks.filter(task => task.priority_level === "Low")
        
        const sortedTasks = highTasks.concat(normalTasks, lowTasks)
        
        if (criteria === 'due_date') {
            sortedTasks.sort(function(a,b){
                return new Date(a.due_date) - new Date(b.due_date)
            })
        }
        
        tasksContainerUl.innerHTML = ''
        sortedTasks.forEach(task =>{
            renderTask(task)
        })
    })
}

//filter event listener
taskFilterButton.addEventListener('click', toggleFilterSubMenu)

function toggleFilterSubMenu() {
    const navSubMenu = document.querySelector("#nav-sub-menu")
    const navSubMenuUl = navSubMenu.querySelector("ul")
    navSubMenuUl.innerHTML = ''
    if (navSubMenuUl.id === 'sort-sub-list' || navSubMenuUl.id === 'nav-sub-menu-ul') {
        navSubMenuUl.id = 'filter-sub-list'
        navSubMenuUl.style.display = 'block'
        
        // filter by tag
        const filterByTagLi = document.createElement('li')
        filterByTagLi.textContent = 'filter by tag'
        const filterByTagInput = document.createElement("input")
        filterByTagLi.append(filterByTagInput)
        filterByTagInput.addEventListener("change", (e) => {
            e.preventDefault()
            filterTasks("tag", e.target.value)
        })
        
        // filter by priority
        const filterByPriorityLi = document.createElement('li')
        filterByPriorityLi.textContent = 'filter by priority'
        const taskPrioritySelectMenu = document.createElement("select")
        const defaultPriority = document.createElement("option")
            defaultPriority.setAttribute("value", "default")
            defaultPriority.textContent = "select"
        const highPriority = document.createElement("option")
            highPriority.setAttribute("value", "High")
            highPriority.textContent = "High"
        const normalPriority = document.createElement("option")
            normalPriority.setAttribute("value", "Normal")
            normalPriority.textContent = "Normal"
        const lowPriority = document.createElement("option")
            lowPriority.setAttribute("value", "Low")
            lowPriority.textContent = "Low"
        taskPrioritySelectMenu.append(defaultPriority, highPriority, normalPriority, lowPriority)
        filterByPriorityLi.append(taskPrioritySelectMenu)
        taskPrioritySelectMenu.addEventListener('change', (e) => {
            if (e.target.value !== "default" ) {
                filterTasks("priority_level", e.target.value)
            }
        })
        
        // filter by completion
        const filterByCompletionLi = document.createElement('li')
        filterByCompletionLi.textContent = 'filter by completion'
        const taskCompletionSelectMenu = document.createElement("select")
        const defaultCompletion = document.createElement("option")
            defaultCompletion.setAttribute("value", "default")
            defaultCompletion.textContent = "select"
        const completeTasks = document.createElement("option")
            completeTasks.setAttribute("value", "true")
            completeTasks.textContent = "Complete"
        const incompleteTasks = document.createElement("option")
            incompleteTasks.setAttribute("value", "false")
            incompleteTasks.textContent = "Incomplete"
        taskCompletionSelectMenu.append(defaultCompletion, completeTasks, incompleteTasks)
        filterByCompletionLi.append(taskCompletionSelectMenu)
        taskCompletionSelectMenu.addEventListener('change', (e) => {
            if (e.target.value !== "default" ) {
                if (e.target.value === "true") {
                    filterTasks("completion_status", true)
                } else if (e.target.value === "false") {
                    filterTasks("completion_status", false)
                }
            }
        })
            
            
        
        navSubMenuUl.append(filterByTagLi,filterByPriorityLi, filterByCompletionLi)
    } else {
        navSubMenuUl.id = 'nav-sub-menu-ul'
        navSubMenuUl.style.display = 'none'
    }
}

function filterTasks(attribute, value) {
    fetch(`${baseUrl}/users/${mainContainer.dataset.id}`)
    .then(resp => resp.json())
    .then(user => {
        const tasks = user.tasks
        let filteredTasks = tasks.filter(task => task[attribute] === value)
        console.log(filteredTasks)
        tasksContainerUl.innerHTML = ''
        filteredTasks.forEach(task =>{
            renderTask(task)
        })
    })
}

const logoutButton = document.querySelector("#logout")
logoutButton.addEventListener("click", (e) => {
    location.reload();
})

function deleteTask(id) {
    fetch(`${baseUrl}/tasks/${id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        console.log("Task deleted")
        taskDetailsDiv.innerHTML = ''
        taskDetailsDiv.style.display = 'none'
        tasksContainerUl.innerHTML = ''
        renderTasks(mainContainer.dataset.id)
    })
}

function taskCompletionToggle(task, status) {
    const newStatus = !status
    fetch(`${baseUrl}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            title: task.title,
            priority_level: task.priority_level,
            due_date: task.due_date,
            tag: task.tag,
            description: task.description,
            completion_status: newStatus,
            user_id: task.user_id
        })
    })
    .then(response => response.json())
    .then(task => {
        console.log(task)    
        if (taskDetailsDiv.innerHTML != ``) {
            renderTaskDetails(task)
        }
        tasksContainerUl.innerHTML = ``
        renderTasks(task.user_id)
    })
}