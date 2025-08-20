"use-strict"

import * as ModalModule from "/modules/modal_view.js"

export class ToDoView {
    #toDoViewModel;
    #toDoElementsMap;

    #parentContainer;
    #upcommingTasksContainer;
    #doneTasksContainer;
    #otherTasksContainer;

    constructor(ToDoController, parentDomElement = document.body) {
        this.#toDoViewModel = ToDoController;
        this.#toDoElementsMap = new Map();
        this.#initializeContainers(parentDomElement);
    }

    renderToDoList() {
        this.#createAddButton();
        const toDoListData = this.#toDoViewModel.toDoListData;
        for(const toDoData of toDoListData){
            if(toDoData)
                this.#createToDoElement(toDoData);
        }

        this.#sortElements(toDoListData);
    }

    #initializeContainers(parentDomElement) {
        this.#parentContainer = parentDomElement.appendChild(document.createElement("div"));
        this.#parentContainer.classList.add("main_todo_container");

        this.#upcommingTasksContainer = this.#parentContainer.appendChild(document.createElement("div"));
        this.#upcommingTasksContainer.classList.add("toDoContainer");
        this.#upcommingTasksContainer.id = "upcomming_tasks";
        const upcommingHeader = this.#upcommingTasksContainer.appendChild(document.createElement("h2"));
        upcommingHeader.classList.add("mainPageText");
        upcommingHeader.textContent = "Upcomming tasks";

        this.#otherTasksContainer = this.#parentContainer.appendChild(document.createElement("div"));
        this.#otherTasksContainer.classList.add("toDoContainer");
        this.#otherTasksContainer.id = "other_tasks";
        const otherHeader = this.#otherTasksContainer.appendChild(document.createElement("h2"));
        otherHeader.classList.add("mainPageText");
        otherHeader.textContent = "Other tasks";

        this.#doneTasksContainer = this.#parentContainer.appendChild(document.createElement("div"));
        this.#doneTasksContainer.classList.add("toDoContainer");
        this.#doneTasksContainer.classList.add("mainPageText");
        this.#doneTasksContainer.id = "done_tasks";
        const doneHeader = this.#doneTasksContainer.appendChild(document.createElement("h2"));
        doneHeader.classList.add("mainPageText");
        doneHeader.textContent = "Done";
    }

    #updateView(){
        let updatedToDos = new Set();
        const toDoListData = this.#toDoViewModel.toDoListData;
        for(const toDoData of toDoListData){
            if(toDoData)
            {
                if(!this.#toDoElementsMap.has(toDoData.id))
                    this.#createToDoElement(toDoData);

                updatedToDos.add(toDoData.id);
            }
        }

        this.#toDoElementsMap.forEach((value, key) => {
            if(!updatedToDos.has(key)){
                this.#toDoElementsMap[key].remove();
                this.#toDoElementsMap.delete(key);
            }
        });

        this.#sortElements(toDoListData);
    }

    #sortElements(toDoListData) {
        if(!toDoListData)
            toDoListData = this.#toDoViewModel.toDoListData;

        toDoListData.sort((toDoLeft, toDoRigth) => {
            if (toDoLeft.isDone !== toDoRigth.isDone) {
                return toDoLeft.isDone ? 1 : -1;
            }

            if (!toDoLeft.isDone && !toDoRigth.isDone) {
                const toDoLeftHasDeadline = toDoLeft.deadline != null;
                const toDoRigthHasDeadline = toDoRigth.deadline != null;

                if (toDoLeftHasDeadline !== toDoRigthHasDeadline) {
                    return toDoLeftHasDeadline ? -1 : 1;
                }

                if (toDoLeftHasDeadline && toDoRigthHasDeadline) {
                    return toDoLeft.deadline - toDoRigth.deadline;
                }

                return 0;
            }

            const dateToDoLeft = toDoLeft.finishDate ? toDoLeft.finishDate : new Date(0);
            const dateToDoRigth = toDoRigth.finishDate ? toDoRigth.finishDate : new Date(0);

            return dateToDoRigth - dateToDoLeft;
        })
        .forEach(toDo => {
            const toDoDom = this.#toDoElementsMap.get(toDo.id);
            if(toDo.isDone)
                this.#doneTasksContainer.appendChild(toDoDom);
            else if(toDo.deadline)
                this.#upcommingTasksContainer.appendChild(toDoDom);
            else
                this.#otherTasksContainer.appendChild(toDoDom);
        });
    }

//#region CheckBox and Text
    #createToDoElement(toDoData) {
        const parentDom = toDoData.isDone 
                            ? this.#doneTasksContainer 
                            : toDoData.Deadline 
                                        ? this.#upcommingTasksContainer 
                                        : this.#otherTasksContainer;

        const label = document.createElement("label");
        label.setAttribute("class", "container");
        parentDom.appendChild(label);
    
        const checkboxInput = label.appendChild(document.createElement("input"));
        checkboxInput.setAttribute("type", "checkbox");
        checkboxInput.id = `checkbox_${toDoData.id}`;
        checkboxInput.checked = toDoData.isDone;
        checkboxInput.addEventListener('input', event => this.#onInput(toDoData.id, event));
    
        const textSpan = label.appendChild(document.createElement("span"));
        textSpan.setAttribute("class", "mainPageText");
        textSpan.textContent = `${toDoData.statement}${toDoData.deadline ? ` - ${toDoData.deadline.toDateString()}` : ""}`;
        textSpan.id = `text_span_${toDoData.id}`;
    
        const checkMarkSpan = label.appendChild(document.createElement("span"));
        checkMarkSpan.setAttribute("class", "checkmark");
    
        this.#toDoElementsMap.set(toDoData.id, label);
        this.#updateTextState(toDoData);
    }

    #onInput(id, event) {
        const toDoData = this.#toDoViewModel.updateToDoDataById(id, "isDone", event.target.checked);
        this.#updateTextState(toDoData);
        this.#updateView();
    }

    #updateTextState(toDoData) {
        const currentDate = new Date();
        let textElement = this.#toDoElementsMap.get(toDoData.id).children[`text_span_${toDoData.id}`];

        if(toDoData.isDone) {
            this.#updateTextColor(textElement, "#015701ff");
        }
        else if(toDoData.deadline && toDoData.deadline < currentDate) {
            this.#updateTextColor(textElement, "#690709ff");
        }
        else {
            this.#updateTextColor(textElement, "black");
        }
    }

    #updateTextColor(textElement, color) {
        textElement.style.color = color;
    }
//#endregion

//#region Adding Elements Modal
    #createAddButton() {
        const createTaskButton = document.createElement("button");
        createTaskButton.textContent = "Add task";
        createTaskButton.onclick = () => this.#showTaskModule();
        document.body.appendChild(createTaskButton);
        document.body.insertBefore(createTaskButton, this.#parentContainer);
    }

    async #showTaskModule() {
        let result = await ModalModule.modalViewsController
        .showModalView("Add Task", 
        [
            new ModalModule.FieldParameter(ModalModule.FieldTypes.Date, ModalModule.ModalToDoViewFieldNames.Deadline),
            new ModalModule.FieldParameter(ModalModule.FieldTypes.Text, ModalModule.ModalToDoViewFieldNames.Task)
        ]);

        if(result) {
            this.#toDoViewModel.addTasksToList(ModalModule.ToDoDataModalExtentions.fromModalViewResult(result));
            this.#updateView();
        }
    }
//#endregion
}