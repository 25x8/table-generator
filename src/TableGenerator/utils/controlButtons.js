const dataPattern = {
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

export function createEditButton(container, store, data, rowPattern) {
    const editButton = document.createElement('button');
    editButton.classList.add('button-delete');
    editButton.textContent = 'Редактировать';
    const index = store.findIndex(el => el.id === data.id);
    container.appendChild(editButton);
    editButton.onclick = () => {
        const saveButton = document.createElement('button');
        saveButton.classList.add('button-save');
        saveButton.textContent = 'Сохранить';
        container.removeChild(editButton);
        container.appendChild(saveButton);
    };

}

function copyData(store, data, tableObject) {
    const index = store.findIndex(el => el.id === data.id);
    const newStore = [...store];
    const newData = {...data, id: `${data.id}-copy`}
    newStore.splice(index + 1, 0, newData);
    tableObject.updateBody(newStore);
}

function deleteData(store, data, tableObject) {
    const index = store.findIndex(el => el.id === data.id);
    const newStore = [...store];
    newStore.splice(index, 1);
    tableObject.updateBody(newStore);
}


