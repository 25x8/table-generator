import './control-buttons.scss';
import 'bootstrap-icons/font/bootstrap-icons.css'
import {deleteDataTable, editData, saveData} from "../../api/api";
import {validateData} from "./validation";
import {TableGenerator} from "../TableGenerator";

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
            if (validateData(data, index + 1)) {
                const tableCopy = document.querySelector('.table-wrapper').cloneNode(true);
                btnController.tableController.HTMLWrapper.style.display = 'none';
                document.querySelector('#root').appendChild(tableCopy)
                btnController.tableController.datatablesWrapper.destroy();
                try {
                    delete data.id
                    const {id: newId} = await saveData(data);
                    newStore[index !== -1 ? index : newStore.length - 1].id = newId;
                    btnController.tableController.updateBody(newStore);
                    alert('Данные изменены');
                } catch (e) {
                    btnController.store.splice(index, 1);
                    btnController.tableController.updateBody(btnController.store);
                    alert('НЕ удалось изменить данные');
                }
                btnController.tableController.initDatatables();
                tableCopy.remove();
                btnController.tableController.HTMLWrapper.style.display = 'inherit';
            } else {
                alert('Данные введены не верно')
            }

        }
    }

    createEditButton({cellHTML, id}) {
        const {editedData, index} = this.selectDataForEdit(id);

        this.buttons.edit = ControlButtons.createButton(
            {
                className: 'button-edit',
                html: '<i class="bi bi-pencil-fill"></i>',
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
            if (validateData(data, index + 1)) {
                const tableCopy = document.querySelector('.table-wrapper').cloneNode(true);
                this.tableController.HTMLWrapper.style.display = 'none';
                document.querySelector('#root').appendChild(tableCopy)
                this.tableController.datatablesWrapper.destroy();
                try {
                    await editData(id, data);
                    this.store[index] = {
                        ...data
                    }
                    alert('Данные изменены')
                } catch (e) {
                    alert('НЕ удалось изменить данные');
                }
                this.tableController.updateBody(this.store);
                this.tableController.initDatatables();
                tableCopy.remove();
                this.tableController.HTMLWrapper.style.display = 'inherit'
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

        selectCell.forEach((select, index) => {
            select.removeAttribute('disabled');
        })

        rowCells.forEach((cell, index) => {

            !cell.querySelector('select') &&
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
                if (e.target.tagName === 'SELECT') {
                    $(e.target).on('select2:select', () => {
                        editGroup[this.rowPattern[index][2]] = $(e.target).val()
                    });
                }

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
        const addBtn = document.querySelector(`.${TableGenerator.addBtnId}`);
        const buttons = document.querySelectorAll('.button-delete, .button-copy,  .button-edit');

        if (disable) {
            buttons.forEach(el => el.setAttribute('disabled', `${disable}`));
            addBtn.classList.add('disabled');
        } else {
            buttons.forEach(el => el.removeAttribute('disabled'));
            addBtn.classList.remove('disabled');
        }
    }

    async deleteData(id) {
        console.log(id)
        const tableCopy = document.querySelector('.table-wrapper').cloneNode(true);
        this.tableController.HTMLWrapper.style.display = 'none';
        document.querySelector('#root').appendChild(tableCopy);
        await this.tableController.datatablesWrapper.destroy();
        const index = this.store.findIndex(el => el.id === id);
        try {
            await deleteDataTable(id);
            this.store.splice(index, 1);
            this.tableController.updateBody(this.store);
            alert('Данные удалены');
        } catch (e) {
            alert('Ошибка удаления')
        }
        this.tableController.initDatatables();
        tableCopy.remove();
        this.tableController.HTMLWrapper.style.display = 'inherit'


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
                    measure: 0
                }, {
                    id: "length",
                    min: null,
                    max: null,
                    eq: null,
                    measure: 0
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

/// data tables +
/// если не dict - инпут +
/// если dict - селект +
/// если  mesure  - добавляется ЕИ, дефолтное если есть - устанавливаем +
/// conf, data, route -> blade(index) +
/// удаление object-object +
/// window.route create - строка // update - функция, в которую передаем id
/// remove -> передаем id
/// try catch в api+
/// const class с loading

// вызываем -



