"use-strict"

function checkboxIdFormat(id) {
    return `checkbox_${id}`
}

function createToDoElement(toDoData, parentDomElement, onInput) {
    const label = parentDomElement.appendChild(document.createElement("label"));
    label.setAttribute("class", "container");

    const checkboxInput = label.appendChild(document.createElement("input"));
    checkboxInput.setAttribute("type", "checkbox");
    checkboxInput.id = checkboxIdFormat(toDoData.id);
    checkboxInput.checked = toDoData.done;
    checkboxInput.addEventListener('input', onInput);

    const textSpan = label.appendChild(document.createElement("span"));
    textSpan.setAttribute("class", "mainPageText");
    textSpan.textContent = `${toDoData.statement} - ${toDoData.deadline ? ` ${toDoData.deadline.toDateString()}` : ""}`;

    const checkMarkSpan = label.appendChild(document.createElement("span"));
    checkMarkSpan.setAttribute("class", "checkmark");

    return textSpan;
}

function updateTextColor(textElement, color) {
    textElement.style.color = color;
}

export { createToDoElement, updateTextColor }