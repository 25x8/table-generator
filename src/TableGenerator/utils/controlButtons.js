import {saveData, deleteDataTable, editData} from "../../api/api";
import regeneratorRuntime from "regenerator-runtime";

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
    editButton.setAttribute('operation-type', 'edit');
    const index = store.findIndex(el => el.id === data.id);
    const editedData = {...store[index]};
    editedData.characteristics = store[index].characteristics.map(el => Object.assign({}, el))
    editedData.rules = store[index].rules.map(el => Object.assign({}, el))
    container.appendChild(editButton);

    editButton.onclick = () => {
        const rowCount = container.getAttribute('row-count');
        const saveButton = document.createElement('button');
        saveButton.classList.add('button-save');
        saveButton.textContent = 'Сохранить';

        const dataCells = document.querySelectorAll(`tr[row-count="${rowCount}"] td[data-cell]`);

        dataCells.forEach((cell, index) => {
            cell.setAttribute('contenteditable', 'true');
            const dataType = rowPattern[index][0];
            let charType, editGroup;
            if (dataType === 'characteristics') {
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
        saveButton.onclick = async () => {
            const type = editButton.getAttribute('operation-type');


            store[index] = {
                ...editedData
            }


            if (type === 'add') {
                try {
                    await saveData(store);
                    tableObject.updateBody(store);
                    alert('Данные добавлены')
                } catch (e) {
                    alert('НЕ удалось добавить данные')
                }
            } else {
                try {
                    await editData(data.id, store);
                    tableObject.updateBody(store);
                    alert('Данные изменены')
                } catch (e) {
                    alert('НЕ удалось изменить данные')
                }
            }


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
    editButton.setAttribute('operation-type', 'add');
    editButton.click();
}

function copyData(store, data, tableObject) {
    const index = store.findIndex(el => el.id === data.id);
    const rowNumber = tableObject.body.rowCount + 1;
    const newStore = [...store];
    const newData = {...data, id: `${data.id}-copy`}
    newStore.splice(index + 1, 0, newData);
    tableObject.updateBody(newStore);
    const editButton = document.querySelector(`td[row-count="${rowNumber}"] .button-edit`);
    editButton.setAttribute('operation-type', 'add');
    editButton.click();
}

async function deleteData(store, data, tableObject) {
    const index = store.findIndex(el => el.id === data.id);
    const newStore = [...store];
    try {
        await deleteDataTable(data.id);
        newStore.splice(index, 1);
        tableObject.updateBody(newStore);
        alert('Данные удалены');
    } catch (e) {
        alert('Ошибка удаления')
    }
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
            }, {
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

// Валидация.
// маска ввода.
// селект.
// при двойном добавлении баг.
// если не 200 - ошибка.
// отправлять только строку.
// адресса в window
// прилепить хедер
// ширина мин 30 пикселей

//====validation

// одно поле заполнено - валидации в каждой группе
// min eq max
// < == min
// > == max ||| max больше min ||| если eq min max не должны иметь значения
// если пустая строка === null
