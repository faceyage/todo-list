import "./style.css";
import ToDoList from "./todo_list";
import { add, addDays } from "date-fns";

class Page {
    renderComponents() {
        // header
        const header = document.querySelector("header");
    
        const logo = document.createElement("div");
        logo.classList.add("logo");
        logo.textContent = "Todo List"
        header.appendChild(logo);
        
        //main
        const main = document.querySelector("main");
    
        //main sidebar
        const sidebar = document.createElement("div");
        sidebar.classList.add("sidebar");
        main.appendChild(sidebar);
        
        const home = document.createElement("button");
        home.classList.add("btn")
        home.textContent = "Home";
        home.onclick = () => {
            toDoList.currentProject = "home";
            toDoList.getProjectTasks("home")
        };
        sidebar.appendChild(home);

        const today = document.createElement("button");
        today.textContent = "Today";
        today.classList.add("btn");
        today.onclick = () => toDoList.getTodaysTasks();
        sidebar.appendChild(today)
    
        const thisWeek = document.createElement("button");
        thisWeek.textContent = "This Week";
        thisWeek.classList.add("btn");
        thisWeek.onclick = () => toDoList.getThisWeekTasks();;
        sidebar.appendChild(thisWeek);

        const projectsText = document.createElement("div");
        projectsText.textContent = "Projects"
        projectsText.classList.add("projectsTitle");
        sidebar.appendChild(projectsText);

        const projectsContainer = document.createElement("div");
        projectsContainer.classList.add("projects");
        sidebar.appendChild(projectsContainer);
        toDoList.renderProjects();

        const addTaskCard = this.addTaskCard();
        document.body.appendChild(addTaskCard);
        
        const detailTab = this.#detailTab();
        document.body.appendChild(detailTab);

        const addBtn = document.createElement("button")
        addBtn.textContent = "+";
        addBtn.classList.add("btn");
        addBtn.id = "addBtn";
        addBtn.onclick = () => {
            addTaskCard.classList.contains("hide") ? addTaskCard.classList.remove("hide") : addTaskCard.classList.add("hide")
            document.body.classList.add("blur");
        };
        sidebar.appendChild(addBtn);

        const tasks = document.createElement("div");
        tasks.classList.add("tasks");
        main.appendChild(tasks);
    }

    #detailTab() {
        const detailsCard = document.createElement("div");
        detailsCard.classList.add("detailsCard");
        detailsCard.classList.add("hide");
        detailsCard.classList.add("pop-up");

        ["project", "title", "due_date", "detail"].forEach((name) => {
            const info = document.createElement("div");
            info.classList.add(`details-tab_${name}`);
            const text = document.createElement("span");
            text.textContent = `${name}:`;
            const value = document.createElement("span");
            info.appendChild(text);
            info.appendChild(value);
            
            detailsCard.appendChild(info);
        });
        
         

        return detailsCard;
    }

    addTaskCard() {
        const addTaskCard = document.createElement("div");
        addTaskCard.classList.add("addTaskCard");
        addTaskCard.classList.add("pop-up");
        addTaskCard.classList.add("hide");

        const addNewHeader = document.createElement("div");
        addNewHeader.classList.add("header");
        addTaskCard.appendChild(addNewHeader);

        const title = document.createElement("div");
        title.id = "add-new-text";
        title.textContent = "Add new..";
        addNewHeader.appendChild(title);
        
        const button_wrapper = document.createElement("div");
        button_wrapper.classList.add("add_buttons");
        addNewHeader.appendChild(button_wrapper);

        const addTaskBtn = document.createElement("button");
        addTaskBtn.classList.add("btn");
        addTaskBtn.textContent = "Task";
        addTaskBtn.onclick = () => {
            const newForm = this.#taskForm(addTaskCard);
            addTaskCard.removeChild(form);
            addTaskCard.appendChild(newForm);
            form = newForm;
            
        };
        button_wrapper.appendChild(addTaskBtn);

        const addProjectBtn = document.createElement("button");
        addProjectBtn.classList.add("btn");
        addProjectBtn.textContent = "Project";
        addProjectBtn.onclick = () => {
            let newForm = this.#projectForm(addTaskCard);
            addTaskCard.removeChild(form);
            addTaskCard.appendChild(newForm);
            form = newForm;
        }
        button_wrapper.appendChild(addProjectBtn);

        let form = this.#taskForm();
        addTaskCard.appendChild(form);
        
        return addTaskCard;
    }

    #taskForm(addTaskCard) {
        const form = document.createElement("form");

        const inputs = []
        inputs.push(["Title", "title", "text", true])
        inputs.push(["Description", "desc", "text", false]);
        inputs.push(["Due Date", "dueDate", "date", true]);
        
        inputs.forEach((input) => {
            const newInput = this.createInput(input[0], input[1], input[2], input[3]);
            form.appendChild(newInput);
        });

        const submitBtn = document.createElement("button");
        submitBtn.classList.add("btn");
        submitBtn.textContent = "Add";
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const title = formData.get("title");
            const desc = formData.get("desc");
            const date = formData.get("dueDate");
            toDoList.createTask(title, desc, date, "high");
            //reset form
            form.reset();
            addTaskCard.classList.add("hide");
        }

        form.appendChild(submitBtn);

        return form;
    }

    #projectForm(addTaskCard) {
        const form = document.createElement("form");

        const newInput = this.createInput("Project Name:", "projectName", "text", true);
        form.appendChild(newInput);

        const submitBtn = document.createElement("button");
        submitBtn.classList.add("btn");
        submitBtn.textContent = "Add";
        form.appendChild(submitBtn);
        
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const projectName = formData.get("projectName");
            toDoList.createProject(projectName);
            toDoList.renderProjects();
            //reset form
            form.reset();
            addTaskCard.classList.add("hide");
        };

        return form;
    }
    createInput(title, id, type, isRequired) {
        const wrapper = document.createElement("div");

        const label = document.createElement("label")
        label.setAttribute("for", id);
        label.textContent = title;
        wrapper.appendChild(label);

        const input = document.createElement("input");
        input.name = id;
        input.id = id;
        input.type = type;
        if (isRequired) {
            input.setAttribute("required", "");
        }
        wrapper.appendChild(input);
        
        return wrapper;
    }
}


function addSomeTasks(toDoList) {
    toDoList.createTask("Cook Dinner", "Do the math homework page 126 - 205", "2022/09/01", "high", true);
    toDoList.createTask("Do Bath", "Do the math homework page 126 - 205", "2022/09/01", "high", true);
    toDoList.createTask("Math Homework", "Do the math homework page 126 - 205", "2022/08/30", "low");
    toDoList.createTask("Clean the House", "Do the math homework page 126 - 205", "2022/09/02", "medium");
    toDoList.createTask("10 Push-UP", "Do the math homework page 126 - 205", "2022/09/16", "high", false, "GYM");
    toDoList.createTask("Make JOY", "Do the math homework page 126 - 205", "2022/09/16", "high",false, "Study");
}
const toDoList = new ToDoList();
toDoList.createProject("Study");
toDoList.createProject("GYM");
const page = new Page();
page.renderComponents();
addSomeTasks(toDoList);
