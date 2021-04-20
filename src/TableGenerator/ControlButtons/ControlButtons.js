import {deleteDataTable, editData, saveData} from "../../api/api";

export class ControlButtons {

    tableController;
    store;
    rowPattern;
    rowHTML;

    buttons = {
        edit: null,
        delete: null,
        save: null
    }

    constructor({tableController, rowHTML}) {
        this.tableController = tableController;
        this.rowPattern = tableController.getRowPattern();
        this.rowHTML = rowHTML;
        this.store = tableController.currentData;
    }

    createControlGroup({cellHTML, id}) {
        this.createDeleteButton({cellHTML, id});
        this.createSaveButton({cellHTML, id});
        // this.createAddButton({cellHTML, id});
        this.createEditButton({cellHTML, id});
        this.createCopyButton({cellHTML, id});
    }

    createCopyButton({cellHTML, id}) {

        this.buttons.copy = ControlButtons.createButton({
            className: 'button-copy',
            text: 'Копировать',
            click: () => {
                this.copyRow(id);
            }
        })
        cellHTML.appendChild(this.buttons.copy);
    }

    copyRow(id) {
        const {editedData, index} = this.selectDataForEdit(id);
        const newStore = [...this.store];
        const newData = {...editedData, id: 'new-id'};
        newStore.splice(index + 1, 0, newData);
        this.tableController.updateBody(newStore, {
            index: index + 1,
            fn: (btnC) => ControlButtons.setSaveButtonAddData(newData, btnC, index + 1, newStore)
        });
    }

    static createAddButton({cellHTML, tableController}) {

        const addButton = ControlButtons.createButton(
            {
                className: 'button-add',
                text: 'Добавить',
                click: async () => {
                    document.querySelector('.button-add').hidden = true;
                    // this.setCellsEditable(editableData);
                    // this.toggleControlButtons(true);
                    // await this.setSaveButtonSaveEdits(id, editableData, index);
                    ControlButtons.createAddRow(tableController);
                }
            });

        cellHTML.appendChild(addButton);
    }

    static createAddRow(tableController) {
        const emptyData = ControlButtons.createEmptyData();
        emptyData.id = "new-id";
        tableController.currentData.push(emptyData);
        tableController.updateBody(tableController.currentData, {
            index: -1,
            fn: (btnC) => ControlButtons.setSaveButtonAddData(emptyData, btnC, -1, tableController.currentData)
        });
    }

    static setSaveButtonAddData(data, btnController, index, newStore) {
        btnController.toggleControlButtons(true);
        btnController.setCellsEditable(data);
        ControlButtons.toggleDisableAllCopyButtons(true);
        btnController.buttons.save.onclick = async () => {
            try {
                await saveData(data);
                btnController.tableController.updateBody(newStore);
                alert('Данные изменены');
            } catch (e) {
                alert('НЕ удалось изменить данные');
                btnController.store.splice(index, 1);
                btnController.tableController.updateBody(btnController.store);
            }
            document.querySelector('.button-add').hidden = false;
        }
    }

    createEditButton({cellHTML, id}) {
        const {editedData, index} = this.selectDataForEdit(id);

        this.buttons.edit = ControlButtons.createButton(
            {
                className: 'button-edit',
                text: 'Редактировать',
                click: async () => {
                    this.setCellsEditable(editedData);
                    this.toggleControlButtons(true);
                    ControlButtons.toggleDisableAllCopyButtons(true);
                    await this.setSaveButtonSaveEdits(id, editedData, index);
                }
            });

        cellHTML.appendChild(this.buttons.edit);
    }

    createSaveButton({cellHTML}) {
        this.buttons.save = ControlButtons.createButton(
            {
                className: 'button-save',
                text: 'Сохранить',
                click: () => {
                }
            });

        cellHTML.appendChild(this.buttons.save);
        this.buttons.save.hidden = true;
    }

    async setSaveButtonSaveEdits(id, data, index) {
        this.buttons.save.onclick = async () => {
            try {
                await editData(id, data);
                this.store[index] = {
                    ...data
                }
                this.tableController.updateBody(this.store);
                alert('Данные изменены')
            } catch (e) {
                alert('НЕ удалось изменить данные');
                this.tableController.updateBody(this.store);
            }

            this.toggleControlButtons(false);
            ControlButtons.toggleDisableAllCopyButtons(false);
        }

    }


    toggleControlButtons(hidden) {
        Object.values(this.buttons).forEach(button => button.hidden = hidden);
        this.buttons.save.hidden = !hidden;
    }

    selectDataForEdit(id) {
        const index = this.store.findIndex(el => el.id === id);
        const editedData = {...this.store[index]};

        editedData.characteristics = this.store[index].characteristics.map(el => Object.assign({}, el))
        editedData.rules = this.store[index].rules.map(el => Object.assign({}, el));

        return {
            editedData,
            index
        };
    }

    setCellsEditable(editableData) {
        const rowCells = this.rowHTML.querySelectorAll('td[data-cell]');

        rowCells.forEach((cell, index) => {
            cell.setAttribute('contenteditable', 'true');
            const dataType = this.rowPattern[index][0];
            let charType, editGroup;
            if (dataType === 'characteristics') {
                charType = editableData[dataType];
                editGroup = charType.filter(el => el.id === this.rowPattern[index][1])[0];
            } else {
                editGroup = editableData['rules'].filter(el => `${el.id}-${el.grade}` === this.rowPattern[index][1])[0];
            }

            cell.oninput = (e) => {
                editGroup[this.rowPattern[index][2]] = e.target.textContent;
            }
        })
    }

    createDeleteButton({cellHTML, id}) {
        const deleteButton = ControlButtons.createButton({
            className: 'button-delete',
            text: 'Удалить',
            click: () => this.deleteData(id)
        });

        cellHTML.appendChild(deleteButton);

        this.buttons.delete = deleteButton;
    }

    static createButton({className, text, click}) {
        const button = document.createElement('button');
        button.className = className;
        button.textContent = text;
        button.onclick = click;

        return button;
    }

    static toggleDisableAllCopyButtons(disable) {
        const buttons = document.querySelectorAll('.button-delete, .button-copy,  .button-edit');
        disable
            ? buttons.forEach(el => el.setAttribute('disabled', `${disable}`))
            : buttons.forEach(el => el.removeAttribute('disabled'))

    }

    async deleteData(id) {
        const index = this.store.findIndex(el => el.id === id);
        try {
            await deleteDataTable(id);
            this.store.splice(index, 1);
            this.tableController.updateBody(this.store);
            alert('Данные удалены');
        } catch (e) {
            alert('Ошибка удаления')
        }
    }

    updateStore(newStore) {
        this.store = newStore;
    }

    static createEmptyData() {
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

}