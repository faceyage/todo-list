import { toDoList } from ".";
import {format} from "date-fns";
import _deleteIcon from "./icons/trash.svg"

class Task {
    constructor (title, description, dueDate, priority, done, projectName) {
        this.title = title;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
        this.done = done;
        this.projectName = projectName;
    }
    
    createElement() {
        const task = document.createElement("div");
        task.classList.add("task");
        task.classList.add(this.priority);
        
        const leftTaskPanel = document.createElement("div");
        leftTaskPanel.classList.add("left-task-panel");
        task.appendChild(leftTaskPanel);

        const checkComplete = document.createElement("input");
        checkComplete.classList.add("checkMark");
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

        const rightTaskPanel = document.createElement("div");
        rightTaskPanel.classList.add("right-task-panel");
        task.appendChild(rightTaskPanel);

        const textDueDate = document.createElement("div");
        textDueDate.classList.add("textDueDate");
        textDueDate.textContent = this.dueDate;
        textDueDate.textContent = format(this.dueDate, 'dd/MM/yyyy');
        textDueDate.onclick = () => {
            textDueDate.classList.add("hide");
            inputDueDate.classList.remove("hide");
        };
        rightTaskPanel.appendChild(textDueDate);

        const inputDueDate = document.createElement("input");
        inputDueDate.classList.add("inputDueDate");
        inputDueDate.classList.add("hide");
        inputDueDate.type = "date";
        inputDueDate.value = this.dueDate;
        inputDueDate.onchange = () => this.#changeDueDate(inputDueDate, textDueDate);
        rightTaskPanel.appendChild(inputDueDate);
        
        const detailBtn = document.createElement("button");
        detailBtn.classList.add("btn");
        detailBtn.textContent = "DETAILS"
        detailBtn.onclick = () => this.#showDetail();
        rightTaskPanel.appendChild(detailBtn);

        const deleteIcon = new Image();
        deleteIcon.src = _deleteIcon;
        deleteIcon.classList.add("deleteIcon");
        deleteIcon.onclick = () => {
            this.#logTask();
            toDoList.removeTask(this, this.projectName)
            toDoList.getProjectTasks(toDoList.currentProject);
        }
        rightTaskPanel.appendChild(deleteIcon)

        return task;
    }

    #showDetail() {
        const content = document.querySelector(".content");
        content.classList.add("blur")
        content.classList.add("disable");
        const detailTab = document.querySelector(".detailsCard");
        detailTab.classList.contains("hide") ? detailTab.classList.remove("hide") : detailTab.classList.add("hide");

        const project = document.querySelector(".details-tab_project");
        project.lastChild.textContent = this.projectName;

        const title = document.querySelector(".details-tab_title");
        title.lastChild.textContent = this.title;

        const due_date = document.querySelector(".details-tab_due_date");
        due_date.lastChild.textContent = format(this.dueDate, 'dd/MM/yyyy');

        const desc = document.querySelector(".details-tab_detail");
        desc.lastChild.textContent = this.description;
    }

    #completeTask() {
        this.done = !this.done;
        this.#logTask();
        toDoList.saveLocalStorage();
    }

    #changeDueDate(inputDueDate, textDueDate) {
        this.dueDate = new Date(inputDueDate.value);
        textDueDate.textContent = format(this.dueDate, 'dd/MM/yyyy');
        inputDueDate.classList.add("hide");
        textDueDate.classList.remove("hide");
        toDoList.saveLocalStorage();
    }

    #logTask() {
        console.log(`Title: ${this.title}\n Desc: ${this.description}\n Due Date: ${this.dueDate}\n Priority: ${this.priority}\n Done: ${this.done ? "✓" : "X"}`)
    }
}

export default Task