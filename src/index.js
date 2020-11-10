const baseUrl = "http://localhost:3000/api/v1"

fetch(`${baseUrl}/users/12`)
.then(response => response.json())
.then(data => console.log(data))


// NEW TASK FORM
const newTaskForm = document.querySelector("#new-task-form")
const newTaskTitle = newTaskForm.querySelector("input[name='title']")
const newTaskDueDate = newTaskForm.querySelector("input[name='due-date']")
const newTaskPriority = newTaskForm.querySelector("select[name='priority']")
const newTaskTag = newTaskForm.querySelector("input[name='tag']")
const newTaskDescription = newTaskForm.querySelector("input[name='description']")

newTaskForm.addEventListener("submit", (event) => {
    event.preventDefault()
    console.log("Task:", newTaskTitle.value)
    console.log("Due date:", newTaskDueDate.value)
    console.log("Priority:", newTaskPriority.value)
    console.log("Tag:", newTaskTag.value)
    console.log("Description:", newTaskDescription.value)

    const newTask = {
        title: newTaskTitle.value,
        priority_level: newTaskPriority.value, 
        due_date: newTaskDueDate.value,
        tag: newTaskTag.value, 
        description: newTaskDescription.value, 
        completion_status: false,
        user_id: 12
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

newTaskForm.addEventListener("submit", (event) => {
    event.preventDefault()
    console.log("Task:", newTaskTitle.value)
    console.log("Due date:", newTaskDueDate.value)
    console.log("Priority:", newTaskPriority.value)
    console.log("Tag:", newTaskTag.value)
    console.log("Description:", newTaskDescription.value)

    const newTask = {
        title: newTaskTitle.value,
        priority_level: newTaskPriority.value, 
        due_date: newTaskDueDate.value,
        tag: newTaskTag.value, 
        description: newTaskDescription.value, 
        completion_status: true,
        user_id: 12
    }

    fetch(baseUrl+'/tasks/53', {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(resp => resp.json())
    .then(data => console.log(data))
})