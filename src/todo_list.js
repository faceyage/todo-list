import { format, isToday, isThisWeek } from "date-fns";
import _deleteIcon from "./icons/trash.svg"


class Task {
    constructor (title, description, dueDate, priority, done, projectName, toDoList) {
        this.title = title;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
        this.done = done;
        this.projectName = projectName;
        this.toDoList = toDoList;
        this.htmlElement = this.#createElement();
    }
    
    #createElement() {
        const task = document.createElement("div");
        task.classList.add("task");
        task.classList.add(this.priority);
        
        const leftTaskPanel = document.createElement("div");
        leftTaskPanel.classList.add("left-task-panel");
        task.appendChild(leftTaskPanel);

        const checkComplete = document.createElement("input");
        checkComplete.type = "checkbox";
        checkComplete.name = checkComplete;
        checkComplete.id = checkComplete;
        checkComplete.checked = this.done;
        checkComplete.onchange = () => this.#completeTask();
        leftTaskPanel.appendChild(checkComplete);

        const title = document.createElement("div");
        title.classList.add("title");
        title.textContent = this.title;
        leftTaskPanel.appendChild(title);

        const textDueDate = document.createElement("div");
        textDueDate.classList.add("textDueDate");
        textDueDate.textContent = this.dueDate;
        textDueDate.textContent = format(this.dueDate, 'dd/MM/yyyy');
        textDueDate.onclick = () => {
            textDueDate.classList.add("hide");
            inputDueDate.classList.remove("hide");
        };
        task.appendChild(textDueDate);

        const inputDueDate = document.createElement("input");
        inputDueDate.classList.add("inputDueDate");
        inputDueDate.classList.add("hide");
        inputDueDate.type = "date";
        inputDueDate.value = this.dueDate;
        inputDueDate.onchange = () => this.#changeDueDate(inputDueDate, textDueDate);
        task.appendChild(inputDueDate);
        
        const detailBtn = document.createElement("button");
        detailBtn.classList.add("btn");
        detailBtn.textContent = "DETAILS"
        detailBtn.onclick = () => this.#showDetail();
        task.appendChild(detailBtn);

        const deleteIcon = new Image();
        deleteIcon.src = _deleteIcon;
        deleteIcon.onclick = () => {
            console.log("remove called for");
            this.#logTask();
            this.toDoList.removeTask(this, this.projectName)
            this.toDoList.getProjectTasks(this.toDoList.currentProject);
        }
        task.appendChild(deleteIcon)

        return task;
    }

    #showDetail() {
        const detailTab = document.querySelector(".detailsCard");
        detailTab.classList.contains("hide") ? detailTab.classList.remove("hide") : detailTab.classList.add("hide");
    }

    #completeTask() {
        this.done = !this.done;
        this.#logTask();

    }

    #changeDueDate(inputDueDate, textDueDate) {
        this.dueDate = new Date(inputDueDate.value);
        textDueDate.textContent = format(this.dueDate, 'dd/MM/yyyy');
        inputDueDate.classList.add("hide");
        textDueDate.classList.remove("hide");
    }

    #logTask() {
        console.log(` Title: ${this.title}\n Desc: ${this.description}\n Due Date: ${this.dueDate}\n Priority: ${this.priority}\n Done: ${this.done ? "✓" : "X"}`)
    }
}

class ToDoList {
    constructor() {
        this.projects = [{
            "name" : "home",
            "tasks" : []
        }]
        this.tasks = [];
        this.currentProject = "home";
    }
    
    createProject(name) {
        this.projects.forEach((project) => {
            if (project.name === name) {
                throw new Error('Project name must be different!')
            } 
        });
        const newProject = {
            "name" : name,
            "tasks" : []
        }
        this.projects.push(newProject);
    }

    createTask(title, description, dueDate, priority, done=false, projectName=this.currentProject) {
        const newTask = new Task(title, description, dueDate, priority, done, projectName, this);
        if (!this.isProjectExist(projectName)) {
            console.log(`${projectName} not exist`)
            this.createProject(projectName);
        }
        for (const project of this.projects) {
            if (project.name == projectName) {
                project.tasks.push(newTask);
                if (projectName === this.currentProject) {
                    this.renderTask(newTask);
                }
            }
        }
    }

    removeTask(task, projectName) {
        for (let i = 0; i < this.projects.length; i++) {
            if (this.projects[i].name === projectName) {
                for (let j = 0; j < this.projects[i].tasks.length; j++) {
                    if (this.projects[i].tasks[j] === task) {
                        this.projects[i].tasks.splice(j, 1);
                        return true;
                    }
                }
                break;
            }
        }
        return false
    }
    
    renderTask(task) {
        const tasks = document.querySelector(".tasks");
        tasks.appendChild(task.htmlElement);
    }

    renderTasks(tasks, reset=true) {
        const tasksElement = document.querySelector(".tasks");
        if (reset) {
            tasksElement.innerHTML = ""
        }
        tasks.forEach(task => {
            tasksElement.appendChild(task.htmlElement);
        });
    }

    getProjectNames(skipDefaultProject=false) {
        let projectNames;
        if (skipDefaultProject) {
            projectNames = this.projects.slice(1).map((project) => project.name);
        }
        else {
            projectNames = this.projects.map((project) => project.name);
        }
        return projectNames;
    }
    
    getProjectTasks(projectName) {
        this.projects.forEach((project) => {
            if (project.name === projectName) {
                this.renderTasks(project.tasks);
            }
        })
    }

    isProjectExist(name) {
        const projectNames = this.getProjectNames();
        for (let i = 0; i < projectNames.length; i++) {
            if (projectNames[i] === name) {
                return true;
            }
        }
        return false;
    }

    getThisWeekTasks() {
        // console.log("Getting this week's tasks...")
        const tasks = []
        for (const project of this.projects) {
            project.tasks.forEach((task) => {
                if (isThisWeek(task.dueDate)) {
                    tasks.push(task);
                }
            })
        }
        console.log(tasks);
        this.renderTasks(tasks);
        // return tasks;
    }

    getTodaysTasks() {
        const tasks = []
        for (const project of this.projects ) {
            project.tasks.forEach((task) => {
                if (isToday(task.dueDate)) {
                    tasks.push(task);
                }
            });
        }
        this.renderTasks(tasks);
    }
}


export default ToDoList;