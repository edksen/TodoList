"use-strict"

import  { generateId }  from "./encription.js";

class ToDoDataInner {
    constructor(id, statement, isDone, deadline, creationDate) {
        this.id = id;
        this.isDone = isDone;
        this.statement = statement;
        this.deadline = deadline;
        this.creationDate = creationDate;
        this.finishDate = null;
    }
}

export class ToDoList {

    #toDoDataArray;

    constructor(toDoDataArray) {
        this.#toDoDataArray = toDoDataArray;
    }

    addToDo(statement, deadline, isDone) {
        const toDoIdLength = 10;
        this.#toDoDataArray.push(new ToDoDataInner(generateId(toDoIdLength), statement, isDone, deadline, new Date()));
    }

    updateToDoDataById(id, field, value) {
        let toDoData = this.#toDoDataArray.find(toDoData => toDoData.id === id);
        if(toDoData && toDoData.id === id)
        {
            toDoData[field] = this.#getValidFieldValue(field, value);
            
            if(field === "isDone") {
                toDoData.finishDate = value ? new Date() : null;
            }
        }

        return structuredClone(toDoData);
    }

    tryDeleteToDo(id) {
        const elementIndex = this.#toDoDataArray.findIndex(toDo => toDo.id === id);
        if(elementIndex > -1) {
            this.#toDoDataArray.splice(elementIndex, 1);
            return true;
        }
        
        return false;
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