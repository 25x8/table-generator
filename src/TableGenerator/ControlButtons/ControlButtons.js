import './control-buttons.scss';
import 'bootstrap-icons/font/bootstrap-icons.css'
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

    static invisibleCells;
    static invisibleButtons;
    static invisibleSaveButton;

    constructor({tableController, rowHTML}) {
        this.tableController = tableController;
        this.rowPattern = tableController.getRowPattern();
        this.rowHTML = rowHTML;
        this.store = tableController.currentData;
    }

    createControlGroup({cellHTML, id}) {
        this.createDeleteButton({cellHTML, id});
        this.createSaveButton({cellHTML, id});
        this.createEditButton({cellHTML, id});
        this.createCopyButton({cellHTML, id});
    }

    createCopyButton({cellHTML, id}) {

        this.buttons.copy = ControlButtons.createButton({
            className: 'button-copy',
            html: '<i class="bi bi-back"></i>',
            click: () => {
                this.copyRow(id);
            }
        })

        const icon = document.createElement('i');
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
                html: '<i class="bi bi-plus-lg"></i>',
                click: async () => {
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
            if (ControlButtons.validateData(data)) {
                try {
                    const newId = await saveData(data);
                    console.log(index)
                    newStore[index !== -1 ? index : newStore.length - 1].id = newId ? newId : Date.now();
                    btnController.tableController.updateBody(newStore);
                    ControlButtons.setHiddenCellsNotEdit();
                    alert('Данные изменены');
                } catch (e) {
                    alert('НЕ удалось изменить данные');
                    btnController.store.splice(index, 1);
                    btnController.tableController.updateBody(btnController.store);
                }
                document.querySelector('.button-add').removeAttribute('disabled');
            } else {
                alert('Данные введены не верно')
            }

            ControlButtons.syncFakeTableRow();
        }
    }

    static validateData(data) {
        let isValid = true;
        data.characteristics.forEach(el => {
            !this.checkValid(el) && (isValid = false)
        });

        if(!isValid) {
            return false
        }

        data.rules.forEach(el => {
            !this.checkValid(el) && (isValid = false)
        })

        return isValid;

    }

    static checkValid(el) {

        (el.min === '' || el.min === 0) && (el.min = null);
        (el.max === '' || el.max === 0) && (el.max = null);
        (el.eq === '' || el.eq === 0) && (el.eq = null);

        if (el.max === null && el.min === null && el.eq === null) {
            return false
        }


        if (el.eq) {
            if (el.min !== null || el.max !== null) {
                return false;
            }
        }

        if (el.min) {
            if (el.max && (el.min > el.max)) {
                return false;
            }
        }

        if (el.max) {
            if (el.min && (el.min > el.max)) {
                return false;
            }
        }

        return true;
    }

    createEditButton({cellHTML, id}) {
        const {editedData, index} = this.selectDataForEdit(id);

        this.buttons.edit = ControlButtons.createButton(
            {
                className: 'button-edit',
                html: '<i class="bi bi-pencil-fill"></i>',
                click: async () => {
                    this.setCellsEditable(editedData);
                    ControlButtons.setHiddenCellsEdit();
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
            if (ControlButtons.validateData(data)) {
                try {
                    await editData(id, data);
                    this.store[index] = {
                        ...data
                    }
                    ControlButtons.setHiddenCellsNotEdit();
                    this.tableController.updateBody(this.store);

                    alert('Данные изменены')
                } catch (e) {
                    alert('НЕ удалось изменить данные');
                    this.tableController.updateBody(this.store);
                }


                this.toggleControlButtons(false);
                ControlButtons.toggleDisableAllCopyButtons(false);
            } else {
                alert('Данные введены неверно')
            }
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
        const selectCell = this.rowHTML.querySelectorAll('select');

        selectCell.forEach(select => {
            select.removeAttribute('disabled');
        })

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
                editGroup[this.rowPattern[index][2]] = Number(e.target.textContent);
                ControlButtons.syncFakeTableRow()
            }
        })
    }

    createDeleteButton({cellHTML, id}) {
        const deleteButton = ControlButtons.createButton({
            className: 'button-delete',
            html: `<i class="bi bi-trash-fill"></i>`,
            click: () => this.deleteData(id)
        });

        cellHTML.appendChild(deleteButton);

        this.buttons.delete = deleteButton;
    }

    static createButton({className, text, click, html}) {
        const button = document.createElement('button');
        button.className = className;
        button.textContent = text;
        button.onclick = click;
        html && button.insertAdjacentHTML('afterbegin', html)

        return button;
    }

    static toggleDisableAllCopyButtons(disable) {
        const buttons = document.querySelectorAll('.button-add, .button-delete, .button-copy,  .button-edit');
        disable
            ? buttons.forEach(el => el.setAttribute('disabled', `${disable}`))
            : buttons.forEach(el => el.removeAttribute('disabled'))

        ControlButtons.syncFakeTableRow();

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

        ControlButtons.syncFakeTableRow();
    }

    updateStore(newStore) {
        this.store = newStore;
    }

    static initializeInvisibleButtons() {
        ControlButtons.invisibleCells = document.querySelectorAll('.table-sticky td[data-cell]');
        ControlButtons.invisibleButtons = document.querySelectorAll('.table-sticky .button-edit, .table-sticky .button-delete, .table-sticky .button-add');
        ControlButtons.invisibleSaveButton = document.querySelector('.table-sticky .button-save');
    }

    static setHiddenCellsEdit() {
        ControlButtons.invisibleCells.forEach(cell => cell.setAttribute('contenteditable', 'true'));
        ControlButtons.invisibleButtons.forEach(btn => btn.hidden = true);
        ControlButtons.invisibleSaveButton.hidden = false;
    }

    static setHiddenCellsNotEdit() {
        ControlButtons.invisibleCells.forEach(cell => cell.removeAttribute('contenteditable'));
        ControlButtons.invisibleButtons.forEach(btn => btn.hidden = false);
        ControlButtons.invisibleSaveButton.hidden = true;
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


    static syncFakeTableRow() {
        const fakeRowCells = document.querySelectorAll(`.table-sticky td[cell-number]`);
        const existRowCells = document.querySelectorAll('table:not(.table-sticky) tr[row-count="1"] td')
        existRowCells.forEach((cell, index) => {
            fakeRowCells[index].style.minWidth = cell.offsetWidth + 'px';
            fakeRowCells[index].style.maxWidth = cell.offsetWidth + 'px';
        })
    }

}