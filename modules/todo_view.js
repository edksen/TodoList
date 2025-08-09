"use-strict"

import * as ModalModule from "/modules/modal_view.js"

export class ToDoView {
    #toDoViewModel;
    #parentDomElement;
    #toDoElementsMap;

    constructor(ToDoController, parentDomElement = document.body) {
        this.#toDoViewModel = ToDoController;
        this.#parentDomElement = parentDomElement;
        this.#toDoElementsMap = new Map();
    }

    renderToDoList() {
        this.#createAddButton();
        for(const toDoData of this.#toDoViewModel.toDoListData){
            if(toDoData)
                this.#createToDoElement(toDoData);
        }
    }

    #updateView(){
        let updatedToDos = new Set();
        for(const toDoData of this.#toDoViewModel.toDoListData){
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
    }

//#region CheckBox and Text
    #createToDoElement(toDoData) {
        const label = this.#parentDomElement.appendChild(document.createElement("label"));
        label.setAttribute("class", "container");
    
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
        this.#parentDomElement.appendChild(createTaskButton);
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