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
const newTaskButton = document.querySelector("#new-task-button")


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
        
        mainContainer.append(taskForm)
        
        //new task form submit
        const newTaskForm = document.querySelector("#new-task-form")
        newTaskForm.addEventListener("submit", (event) => {
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
            .then(data => {
                console.log(data)
                // newTaskForm.remove()
                // RENDER NEW TASK SUBMISSION DETAILS
            })
        })
        
        // close new task form
        const closeFormBtn = newTaskForm.querySelector("#close-form")
        closeFormBtn.addEventListener("click", () => {
            newTaskForm.remove()
        })
        
    }
})


// edit function