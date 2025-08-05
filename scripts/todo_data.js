"use-strict"

let lastToDoElementId = 0;
let ToDoElements = new Set();
let runningCheck = false;

class ToDoData {
    constructor(id, done, text, deadline) {
        this.id = id;
        this.done = done;
        this.statement = text;
        this.deadline = deadline;
    }
}

function createToDoElement(toDoData, parrentDOMElement) {
    const checkboxId = lastToDoElementId++;

    const label = parrentDOMElement.appendChild(document.createElement("label"));
    label.setAttribute("class", "container");

    const checkboxInput = label.appendChild(document.createElement("input"));
    checkboxInput.setAttribute("type", "checkbox");
    checkboxInput.setAttribute("id", `checkbox_${checkboxId}`)
    checkboxInput.checked = toDoData.done;

    const textSpan = label.appendChild(document.createElement("span"));
    textSpan.setAttribute("class", "label-text mainPageText");
    textSpan.textContent = `${toDoData.statement} - ${toDoData.deadline ? ` ${toDoData.deadline.toDateString()}` : ""}`;

    const checkMarkSpan = label.appendChild(document.createElement("span"));
    checkMarkSpan.setAttribute("class", "checkmark");

    ToDoElements.add({toDo: toDoData, textElement: textSpan});
    checkDeadlines();
}

function checkDeadlines() {
    if(runningCheck)
        return;

    runningCheck = true;
    setInterval(() => {
        let currentDate = new Date();
        ToDoElements.forEach(toDoElement => {
            if(!toDoElement.toDo.done && toDoElement.toDo.deadline < currentDate){
                toDoElement.textElement.style.color = "red";
            }
        });
    }, 500);
}

export { ToDoData, createToDoElement };