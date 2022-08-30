import "./style.css";
import ToDoList from "./todo_list";

function renderComponents() {
    // header
    const header = document.querySelector("header");

    const logo = document.createElement("div");
    logo.classList.add("logo");
    logo.textContent = "Todo List"
    header.appendChild(logo);
    
    //main
    const main = document.querySelector("main");

    const sidebar = document.createElement("div");
    sidebar.classList.add("sidebar");
    main.appendChild(sidebar);

    const tasks = document.createElement("div");
    tasks.classList.add("tasks");
    main.appendChild(tasks);
}

renderComponents();
const toDoList = new ToDoList();
toDoList.createTask("Math Homework", "Do the math homework page 126 - 205", "30/08/2022", "low", true);
toDoList.createTask("Cook Dinner", "Do the math homework page 126 - 205", "30/08/2022", "high");
toDoList.createTask("Cook Dinner", "Do the math homework page 126 - 205", "30/08/2022", "high");
toDoList.createTask("Cook Dinner", "Do the math homework page 126 - 205", "30/08/2022", "high");
toDoList.createTask("Cook Dinner", "Do the math homework page 126 - 205", "30/08/2022", "high");

console.log(toDoList.getProjectNames());