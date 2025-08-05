"use-strict"
import {createToDoElement, updateTextColor} from "/modules/checklist_view_handler.js"

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
    #parentDomElement;

    constructor() {
        this.#toDoDataSet = new Set();
        this.#toDoTextElements = new Map();
    }

    initializeToDoList(toDoDataSet, parentDomElement) {
        this.#parentDomElement = parentDomElement;
        toDoDataSet.forEach(toDoData => {
            this.#toDoDataSet.add(toDoData);
            this.#toDoTextElements.set(toDoData.id, createToDoElement(toDoData, this.#parentDomElement, (event) => this.#onInput(toDoData, event)));
            this.#updateTextState(toDoData);
        });
    }

    #onInput(toDoData, event) {
       toDoData.done = event.target.checked;
       this.#updateTextState(toDoData);
    }

    #updateTextState(toDoData) {
        const currentDate = new Date();

        if(toDoData.done) {
            updateTextColor(this.#toDoTextElements.get(toDoData.id), "#015701ff");
        }
        else if(toDoData.deadline < currentDate) {
            updateTextColor(this.#toDoTextElements.get(toDoData.id), "#690709ff");
        }
        else {
            updateTextColor(this.#toDoTextElements.get(toDoData.id), "black");
        }
    }
}

export const toDoList = new ToDoList();