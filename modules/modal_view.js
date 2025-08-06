"use-strict"

const FieldTypes = {
    Date: "date",
    Text: "text"
}

class FieldParameter {
    constructor(type, name) {
        this.fieldType = type;
        this.fieldName = name;
    }
}

class ModalViewsController {
    #generatedModals;

    constructor() {
        this.#generatedModals = new Map();
    }

    showModalView(modalTitle, fields) {

        const modalOverlay = this.#hasGeneratedModalView(modalTitle) 
            ? this.#generatedModals.get(modalTitle) 
            : this.#generateModalView(modalTitle, fields);
    
        modalOverlay.style.display = "flex";

        return new Promise(resolve => {
            modalOverlay.submitButton.onclick = () => {
                modalOverlay.style.display = "none";
                resolve(modalOverlay.getDataFromInputsAndClear());
            };

            modalOverlay.cancelButton.onclick = () => { 
                modalOverlay.style.display = "none";
                resolve(null);
            };
        });
    }

    #hasGeneratedModalView(modalTitle) {
        return this.#generatedModals.has(modalTitle);
    }

    #generateModalView(modalTitle, fields) {
        let modalOverlay = document.body.appendChild(document.createElement("div"));
        modalOverlay.id = "modalOverlay";
        modalOverlay.className = "modal-overlay";
        modalOverlay.inputs = new Array();
        modalOverlay.getDataFromInputsAndClear = () => {
            let result = new Map();
            modalOverlay.inputs.forEach(input => {
                result.set(input.name, input.value);
                input.value = "";
            });

            return result;
        }

        const modalView = modalOverlay.appendChild(document.createElement("div"));
        modalView.className = "modal";

        const text = modalView.appendChild(document.createElement("h2"));
        text.textContent = modalTitle;

        fields.forEach(field => {
            const input = modalView.appendChild(document.createElement("input"));
            input.type = field.fieldType;
            input.id = field.fieldName.toLowerCase();
            input.placeholder = field.fieldType === FieldTypes.Date ? new Date().toDateString() : `Input ${field.fieldName} here`;
            input.name = field.fieldName;

            const label = modalView.appendChild(document.createElement("label"));
            label.id = `input_label_${input.id}`;
            label.textContent = field.fieldName;
            label.setAttribute("for", input.id);

            modalOverlay.inputs.push(input);
        });

        modalView.appendChild(document.createElement("br"));

        const submitButton = modalView.appendChild(document.createElement("button"));
        submitButton.textContent = "Save";
        

        const cancelButton = modalView.appendChild(document.createElement("button"));
        cancelButton.textContent = "Cancel";

        modalOverlay.submitButton = submitButton;
        modalOverlay.cancelButton = cancelButton;
        modalOverlay.addEventListener("onClick", () => {
            modalOverlay.cancelButton.onclick();
        });

        this.#generatedModals.set(modalTitle, modalOverlay);

        return modalOverlay;
    }
}

export { FieldTypes, FieldParameter}
export const modalViewsController = new ModalViewsController();