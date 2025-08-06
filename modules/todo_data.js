"use-strict"
import * as ChecklistViewModule from "./checklist_view_handler.js"
import  { generateId }  from "./encription.js";

class ToDoDataInner {
    constructor(id, toDoData) {
        this.id = id;
        this.done = toDoData.done;
        this.statement = toDoData.statement;
        this.deadline = toDoData.deadline;
    }
}

class ToDoList {

    #toDoLocalStorageName = "to-do-list"
    #initialized;

    #toDoDataSet;
    #toDoTextElements;
    #parentDomElement;

    constructor() {
        this.#toDoTextElements = new Map();
        this.#toDoDataSet = this.#getDataFromLocalStorage();
        this.#initialized = false;
    }

    initializeList(parentDomElement) {
        if(this.#initialized)
            return;

        this.#parentDomElement = parentDomElement;
        this.#toDoDataSet.forEach(toDo => this.#createElementForTask(toDo));
    }

    addTasksToList(...newToDos) {
        newToDos.forEach(toDoData => {
            if(toDoData && !toDoData.empty()) {
                const toDoInner = new ToDoDataInner(generateId(10), toDoData);
                this.#toDoDataSet.push(toDoInner);
                this.#createElementForTask(toDoInner);
            }
        });

        if(newToDos.length > 0)
            this.#updateDataInLocalStorage();
    }

    #getDataFromLocalStorage() {
        const rawData = localStorage.getItem(this.#toDoLocalStorageName);
        const parsed = JSON.parse(rawData, (key, value) => {
            if(key === "deadline")
                return new Date(value);

            return value;
        });

        return parsed && parsed.length ? Array.from(parsed) : new Array();
    }

    #updateDataInLocalStorage() {
        localStorage.setItem(this.#toDoLocalStorageName, JSON.stringify(Array.from(this.#toDoDataSet)));
    }

    #createElementForTask(toDoData) {
        this.#toDoTextElements.set(toDoData.id, ChecklistViewModule.createToDoElement(toDoData, this.#parentDomElement, (event) => this.#onInput(toDoData, event)));
        this.#updateTextState(toDoData);
    }

    #onInput(toDoData, event) {
       toDoData.done = event.target.checked;
       this.#updateTextState(toDoData);
       this.#updateDataInLocalStorage();
    }

    #updateTextState(toDoData) {
        const currentDate = new Date();
        let textElement = this.#toDoTextElements.get(toDoData.id);

        if(toDoData.done) {
            ChecklistViewModule.updateTextColor(textElement, "#015701ff");
        }
        else if(toDoData.deadline && toDoData.deadline < currentDate) {
            ChecklistViewModule.updateTextColor(textElement, "#690709ff");
        }
        else {
            ChecklistViewModule.updateTextColor(textElement, "black");
        }
    }
}

export const toDoList = new ToDoList();
export class ToDoData {
    constructor(text, done, deadline) {
        this.done = done;
        this.statement = text;
        this.deadline = deadline;
    }

    empty() {
        return !this.statement || this.statement.length === 0
    }
}