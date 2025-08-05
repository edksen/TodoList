"use-strict"

export class ToDoData {
    constructor(id, done, text, deadline) {
        this.id = id;
        this.done = done;
        this.statement = text;
        this.deadline = deadline;
    }
}

class ToDoList {

    #toDoDataSet;
    #toDoTextElements;
    #dedlineCheckInterval;

    constructor(){
        this.#toDoDataSet = new Set();
        this.#toDoTextElements = new Map();
    }

    createToDoElements(toDoDataSet, parrentDomElement) {
        toDoDataSet.forEach(toDoData => {
            this.#toDoDataSet.add(toDoData);
            this.#toDoTextElements.set(toDoData.id, this.#createToDoElement(toDoData, parrentDomElement));
        });
        
        this.#checkDeadlinesLoop();
    }

    #createToDoElement(toDoData, parentDomElement) {
        const label = parentDomElement.appendChild(document.createElement("label"));
        label.setAttribute("class", "container");

        const checkboxInput = label.appendChild(document.createElement("input"));
        checkboxInput.setAttribute("type", "checkbox");
        checkboxInput.setAttribute("id", `checkbox_${toDoData.id}`)
        checkboxInput.checked = toDoData.done;

        const textSpan = label.appendChild(document.createElement("span"));
        textSpan.setAttribute("class", "mainPageText");
        textSpan.textContent = `${toDoData.statement} - ${toDoData.deadline ? ` ${toDoData.deadline.toDateString()}` : ""}`;

        const checkMarkSpan = label.appendChild(document.createElement("span"));
        checkMarkSpan.setAttribute("class", "checkmark");

        return textSpan;
    }

    #checkDeadlinesLoop() {
        if(this.#dedlineCheckInterval)
            return;

        this.#dedlineCheckInterval = setInterval(() => {
            let currentDate = new Date();
            this.#toDoDataSet.forEach(toDoElement => {
                if(!toDoElement.done && toDoElement.toDo.deadline < currentDate) {
                    this.#toDoTextElements.get(toDoElement.id).style.color = "#7B1113";
                }
            });
        }, 500);
    }
}

export const toDoList = new ToDoList();