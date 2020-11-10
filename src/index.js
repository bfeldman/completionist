const baseUrl = "http://localhost:3000/api/v1"

fetch(`${baseUrl}/users/1`)
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
    console.log("Task:", newTaskTitle.value)
})