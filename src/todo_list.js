class Task {
    constructor (title, description, dueDate, priority, done) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.done = done;
        this.htmlElement = this.#createElement();
    }
    
    #createElement() {
        const task = document.createElement("div");
        task.classList.add("task");

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

        const dueDate = document.createElement("dueDate");
        dueDate.textContent = this.dueDate;
        task.appendChild(dueDate);

        return task;
    }

    #completeTask() {
        this.done = !this.done;
        this.#logTask();

    }

    #logTask() {
        console.log(` Title: ${this.title}\n Desc: ${this.description}\n Due Date: ${this.dueDate}\n Priority: ${this.priority}\n Done: ${this.done ? "✓" : "X"}`)
    }
}

class ToDoList {
    constructor() {
        this.projects = [{
            "name" : "Inbox",
            "tasks" : []
        }]
        this.tasks = [];
    }
    
    createProject(name) {
        this.projects.forEach((project) => {
            if (project.name === name) {
                alert("Project name must be different!")
                throw new Error('Project name must be different!')
            } 
        });
        const newProject = {
            "name" : name,
            "tasks" : []
        }
        this.projects.push(newProject);
    }

    createTask(title, description, dueDate, priority, done=false) {
        const newTask = new Task(title, description, dueDate, priority, done);
        this.tasks.push(newTask);
        this.renderTask(newTask);
    }
    
    renderTask(task) {
        const tasks = document.querySelector(".tasks");
        tasks.appendChild(task.htmlElement);
    }

    getProjectNames() {
        const projectNames = this.projects.map((project) => project.name);
        return projectNames;
    }
}

class Projects {

}


export default ToDoList;