"use-strict"

import { ToDoList } from "./todo_data.js";

export class ToDoData {
    constructor(text, isDone = false, deadline = undefined) {
        this.isDone = isDone;
        this.statement = text;
        this.deadline = deadline;
    }

    empty() {
        return !this.statement || this.statement.length === 0
    }
}

export class ToDoController {

    #toDoLocalStorageName = "to-do-list";
    #toDoData;

    constructor() {
        this.#toDoData = new ToDoList(this.#getDataFromLocalStorage());
    }

    addTasksToList(...newToDos) {
        newToDos.forEach(toDoData => {
            if(toDoData && !toDoData.empty()) {
                this.#toDoData.addToDo(toDoData.statement, toDoData.deadline, toDoData.isDone);
            }
        });

        if(newToDos.length > 0)
            this.#updateDataInLocalStorage();
    }

    updateToDoDataById(id, field, value) {
        if(id && field)
        {
            let changedToDoData = this.#toDoData.updateToDoDataById(id, field, value);
            this.#updateDataInLocalStorage();
            return changedToDoData;
        }
    }

    deleteToDo(toDoId) {
        if(this.#toDoData.tryDeleteToDo(toDoId)){
            this.#updateDataInLocalStorage();
        }
    }

    get toDoListData() {
        return this.#toDoData.toDoListData;
    }

    getToDoById(id) {
        return this.#toDoData.toDoListData.find(element => element.id === id);
    }

    #getDataFromLocalStorage() {
        const rawData = localStorage.getItem(this.#toDoLocalStorageName);
        const parsed = JSON.parse(rawData, (key, value) => {
            if(key === "deadline")
                return new Date(value);

            return value;
        });

        return parsed && parsed.length ? parsed : new Array();
    }

    #updateDataInLocalStorage() {
        localStorage.setItem(this.#toDoLocalStorageName, JSON.stringify(Array.from(this.#toDoData.toDoListData)));
    }
}