"use-strict"

import  { generateId }  from "./encription.js";

class ToDoDataInner {
    constructor(id, statement, isDone, deadline) {
        this.id = id;
        this.isDone = isDone;
        this.statement = statement;
        this.deadline = deadline;
    }
}

export class ToDoList {

    #toDoDataArray;

    constructor(toDoDataArray) {
        this.#toDoDataArray = toDoDataArray;
    }

    addToDo(statement, deadline, isDone) {
        const toDoIdLength = 10;
        this.#toDoDataArray.push(new ToDoDataInner(generateId(toDoIdLength), statement, isDone, deadline));
    }

    updateToDoDataById(id, field, value) {
        let toDoData = this.#toDoDataArray.find(toDoData => toDoData.id === id);
        if(toDoData && toDoData.id === id)
        {
            toDoData[field] = this.#getValidFieldValue(field, value);   
        }

        return structuredClone(toDoData);
    }

    get toDoListData() {
        return structuredClone(this.#toDoDataArray);
    }

    #getValidFieldValue(fieldName, fieldValue){
        switch(fieldName){
            case "deadline":
                if(typeof fieldValue === "Date" || fieldValue === undefined)
                    return value;
                else
                    return undefined;
            default:
                return fieldValue;
        }
    }
}