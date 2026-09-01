const addTodoBtn = document.getElementById("addTodoBtn")
const inputTag = document.getElementById("todoInput")
const todoListUl = document.getElementById("todoList")
const remaining = document.getElementById("remaining-count")
const clearCompletedBtn = document.getElementById("clearCompletedBtn")

const filterBtns = document.querySelectorAll(".filter-btn")

let todoText
let todos = []
let currentFilter = "all"

let todosString = localStorage.getItem("todos")


// ========================================
// GET TODOS FROM LOCAL STORAGE
// ========================================

if (todosString) {
    todos = JSON.parse(todosString)
}


// ========================================
// POPULATE TODOS
// ========================================

const populateTodos = () => {

    let string = ""

    for (const todo of todos) {

        // If Active filter is selected,
        // don't show completed todos
        if (currentFilter === "active" && todo.isCompleted) {
            continue
        }

        // If Completed filter is selected,
        // don't show active todos
        if (currentFilter === "completed" && !todo.isCompleted) {
            continue
        }


        string += `
            <li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.isCompleted ? "checked" : ""}
                >

                <span class="todo-text">${todo.title}</span>

                <button class="delete-btn">×</button>
            </li>
        `
    }

    todoListUl.innerHTML = string


    // ========================================
    // DELETE BUTTON
    // ========================================

    const deleteBtns = document.querySelectorAll(".delete-btn")

    deleteBtns.forEach((element) => {

        element.addEventListener("click", (e) => {

            const confirmation = confirm("Do you want to remove this todo")

            if (confirmation) {

                const id = e.target.parentNode.id

                todos = todos.filter((todo) => {
                    return todo.id !== id
                })

                localStorage.setItem("todos", JSON.stringify(todos))

                populateTodos()
            }
        })
    })


    // ========================================
    // CHECKBOX
    // ========================================

    const todoCheckboxes = document.querySelectorAll(".todo-checkbox")

    todoCheckboxes.forEach((element) => {

        element.addEventListener("click", (e) => {

            const id = element.parentNode.id

            todos = todos.map((todo) => {

                if (todo.id === id) {

                    return {
                        ...todo,
                        isCompleted: e.target.checked
                    }
                }

                return todo
            })

            localStorage.setItem("todos", JSON.stringify(todos))

            populateTodos()
        })
    })


    // ========================================
    // REMAINING COUNT
    // ========================================

    remaining.innerHTML = todos.filter((todo) => {
        return !todo.isCompleted
    }).length
}


// ========================================
// ADD TODO
// ========================================

addTodoBtn.addEventListener("click", () => {

    todoText = inputTag.value

    if (todoText.trim().length < 4) {

        alert("Task should have atleast 4 characters!")

        return
    }

    inputTag.value = ""

    const todo = {
        id: "todo-" + Date.now(),
        title: todoText,
        isCompleted: false
    }

    todos.push(todo)

    localStorage.setItem("todos", JSON.stringify(todos))

    populateTodos()
})


// ========================================
// CLEAR COMPLETED
// ========================================

clearCompletedBtn.addEventListener("click", () => {

    todos = todos.filter((todo) => {
        return !todo.isCompleted
    })

    localStorage.setItem("todos", JSON.stringify(todos))

    populateTodos()
})


// ========================================
// FILTER BUTTONS
// ========================================

filterBtns.forEach((button) => {

    button.addEventListener("click", () => {

        // Get "all", "active", or "completed"
        currentFilter = button.dataset.filter

        // Remove active class from all buttons
        filterBtns.forEach((btn) => {
            btn.classList.remove("active")
        })

        // Add active class to clicked button
        button.classList.add("active")

        // Display the correct todos
        populateTodos()
    })
})


// ========================================
// INITIAL LOAD
// ========================================

populateTodos()