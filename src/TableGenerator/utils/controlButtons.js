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