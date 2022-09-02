import { isToday, isThisWeek } from "date-fns";
import Task from "./task";
import _deleteIcon from "./icons/trash.svg"
import { toDoList } from ".";

class ToDoList {
    constructor() {
        this.projects = [{
            "name" : "home",
            "tasks" : []
        }]
        this.currentProject = "home";
    }

    saveLocalStorage() {
        const projects_json = JSON.stringify(this.projects);
        localStorage.setItem("projects", projects_json);
    }

    loadLocalStorage() {
        let projects = JSON.parse(localStorage.getItem("projects"));
        
        for (let i = 0; i < projects.length; i++) {
            //create project first
            if (!this.isProjectExist(projects[i].name)) {
                // console.log(`Project not exist project creating! ${projects[i].name}`)
                this.createProject(projects[i].name);
            }
            for (let j = 0; j < projects[i].tasks.length; j++) {
                const task = projects[i].tasks[j];
                const newTask = this.createTask(task.title, task.description, task.dueDate, task.priority, task.done, projects[i].name);
                projects[i].tasks[j] = newTask;
            }
        }
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
        this.renderProjects();
        this.saveLocalStorage();
    }

    createTask(title, description, dueDate, priority, done=false, projectName=this.currentProject) {
        const newTask = new Task(title, description, dueDate, priority, done, projectName, this);
        if (!this.isProjectExist(projectName)) {
            this.createProject(projectName);
            this.renderProjects();
        }
        for (const project of this.projects) {
            if (project.name == projectName) {
                project.tasks.push(newTask);
                if (projectName === this.currentProject) {
                    this.renderTask(newTask);
                }
            }
        }
        this.saveLocalStorage();
    }

    removeTask(task, projectName) {
        for (let i = 0; i < this.projects.length; i++) {
            if (this.projects[i].name === projectName) {
                for (let j = 0; j < this.projects[i].tasks.length; j++) {
                    if (this.projects[i].tasks[j] === task) {
                        this.projects[i].tasks.splice(j, 1);
                        this.saveLocalStorage();
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
        tasks.appendChild(task.createElement());
    }

    renderTasks(tasks, reset=true) {
        const tasksElement = document.querySelector(".tasks");
        if (reset) {
            tasksElement.innerHTML = ""
        }
        tasks.forEach(task => {
            tasksElement.appendChild(task.createElement());
        });
    }

    renderProjects(reset=true) {
        const projects = document.querySelector(".projects");
        if (reset) {
            projects.innerHTML = "";
        }
        this.getProjectNames(true).forEach((projectName) => {
            const project = document.createElement("button");
            project.classList.add("projectBtn");
            project.classList.add("btn");
            project.textContent = projectName;
            project.onmouseover = () => {
                deleteIcon.classList.remove("hide");
            }
            project.onmouseout = () => {
                deleteIcon.classList.add("hide");
            }

            const deleteIcon = new Image();
            deleteIcon.src = _deleteIcon;
            deleteIcon.classList.add("hide");
            deleteIcon.classList.add("deleteIcon");
            deleteIcon.onclick = () => {
                for (let i = 0; i < this.projects.length; i++) {
                    if (this.projects[i].name === projectName) {
                        this.projects.splice(i, 1);
                        this.renderProjects();
                        this.saveLocalStorage();
                    }
                }
            };
            project.appendChild(deleteIcon);

            project.onclick = () => {
                this.currentProject = projectName;
                this.getProjectTasks(projectName);
            }
            
            projects.appendChild(project);
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