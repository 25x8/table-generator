export function createCopyButton(container, store, data, tableObject) {
    const button = document.createElement('button');
    button.classList.add('button-copy');
    button.textContent = 'Копировать';
    button.onclick = () => copyData(store, data, tableObject);
    container.appendChild(button);
}

export function createDeleteButton(container, store, data, tableObject) {
    const button = document.createElement('button');
    button.classList.add('button-delete');
    button.textContent = 'Удалить';
    button.onclick = () => deleteData(store, data, tableObject);
    container.appendChild(button);
}

export function createAddButton(container, store, tableObject) {
    const button = document.createElement('button');
    button.classList.add('button-add');
    button.textContent = 'Добавить';
    button.onclick = () => addData(tableObject);
    container.appendChild(button);
}

export function createEditButton(container, store, data, tableObject, rowPattern) {
    const buttons = container.querySelectorAll('button');
    const editButton = document.createElement('button');
    editButton.classList.add('button-edit');
    editButton.textContent = 'Редактировать';
    const index = store.findIndex(el => el.id === data.id);
    const editedData = {...store[index]};
    container.appendChild(editButton);

    editButton.onclick = () => {
        const rowCount = container.getAttribute('row-count')
        const saveButton = document.createElement('button');
        saveButton.classList.add('button-save');
        saveButton.textContent = 'Сохранить';

        const dataCells = document.querySelectorAll(`tr[row-count="${rowCount}"] td[data-cell]`);

        dataCells.forEach((cell, index) => {
            cell.setAttribute('contenteditable', 'true');
            const dataType = rowPattern[index][0];
            let charType, editGroup;
            if(dataType === 'characteristics') {
                charType = editedData[dataType];
                editGroup = charType.filter(el => el.id === rowPattern[index][1])[0];
            } else {
                 editGroup = editedData['rules'].filter(el => `${el.id}-${el.grade}` === rowPattern[index][1])[0];
            }

            cell.oninput = (e) => {
                editGroup[rowPattern[index][2]] = e.target.textContent;
            }

        });

        buttons.forEach(el => el.hidden = true);
        saveButton.onclick = () => {

            store[index] = {
                ...editedData
            }

            tableObject.updateBody(store);
        }
        container.removeChild(editButton);
        container.appendChild(saveButton);
    };
}


function addData(tableObject) {
    const emptyData = createEmptyData();
    emptyData.id += '12' + Date.now();
    tableObject.currentData.push(emptyData);
    tableObject.updateBody(tableObject.currentData);
    const editButton = document.querySelector(`td[row-count="${tableObject.body.rowCount}"] .button-edit`);
    editButton.click();
}

function copyData(store, data, tableObject) {
    const index = store.findIndex(el => el.id === data.id);
    const rowNumber = tableObject.body.rowCount;
    const newStore = [...store];
    const newData = {...data, id: `${data.id}-copy`}
    newStore.splice(index + 1, 0, newData);
    tableObject.updateBody(newStore);
    const editButton = document.querySelector(`td[row-count="${rowNumber}"] .button-edit`);
    editButton.click();
}

function deleteData(store, data, tableObject) {
    const index = store.findIndex(el => el.id === data.id);
    const newStore = [...store];
    newStore.splice(index, 1);
    tableObject.updateBody(newStore);
}

function createEmptyData() {
    return {
        id: "new-row",
        characteristics: [
            {
                id: "weight",
                min: null,
                max: null,
                eq: null,
            },{
                id: "length",
                min: null,
                max: null,
                eq: null,
            }
        ],
        rules: [
            {
                id: "inner_diameter",
                min: null,
                max: null,
                eq: null,
                grade: "premium"
            },
            {
                id: "outer_diameter",
                min: null,
                max: null,
                eq: null,
                grade: "premium"
            },
            {
                id: "inner_diameter",
                min: null,
                max: null,
                eq: null,
                grade: "secondary"
            },
            {
                id: "outer_diameter",
                min: null,
                max: null,
                eq: null,
                grade: "secondary"
            },
            {
                id: "inner_diameter",
                min: null,
                max: null,
                eq: null,
                grade: "reject"
            },
            {
                id: "outer_diameter",
                min: null,
                max: null,
                eq: null,
                grade: "reject"
            },
        ]
    }
}
