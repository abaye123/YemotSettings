function loadElements() {
    const definitionsDiv = document.getElementById('definitions');

    createTitle(definitionsDiv, 'def_title', 'בטעינה')
    createPp(definitionsDiv, 'def_desc', 'בטעינה')

    createPp(definitionsDiv, 'def_def_desc', 'בטעינה')
    createSelect(definitionsDiv, id)
}


function createButton(definitionsDiv, id, text) {
    const newButton = document.createElement('button');
    newButton.id = id;
    newButton.textContent = text;
    definitionsDiv.appendChild(newButton);
}

function createInput(definitionsDiv, id, text) {
    const newInput = document.createElement('input');
    newInput.id = id;
    newInput.placeholder = text;
    definitionsDiv.appendChild(newInput);
}

function createTitle(definitionsDiv, id, text) {
    const titleElement = document.createElement('h2');
    titleElement.id = id;
    titleElement.textContent = text;
    definitionsDiv.appendChild(titleElement);
}

function createPp(definitionsDiv, id, text) {
    const descriptionElement = document.createElement('p');
    descriptionElement.id = id;
    descriptionElement.textContent = text;
    definitionsDiv.appendChild(descriptionElement);
}

function createSelect(definitionsDiv, id) {
    const descriptionElement = document.createElement('select');
    descriptionElement.id = id;
    definitionsDiv.appendChild(descriptionElement);
}