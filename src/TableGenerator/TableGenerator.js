import {Header} from "./Header/Header";
import {Body} from "./Body/Body";
import "./table.scss";
import {ControlButtons} from "./ControlButtons/ControlButtons";

export class TableGenerator {
    HTMLWrapper;
    HTMLTable;
    header;
    body;
    dataTransformator;
    currentData;
    fakeTable;

    constructor({container, headerData}) {
        this.createWrapper(container);
        this.createTable();
        this.createFakeTable();
        this.createHeader(headerData);
    }

    createWrapper(container) {
        this.HTMLWrapper = document.createElement('div');
        this.HTMLWrapper.classList.add('table-wrapper');
        container.appendChild(this.HTMLWrapper);
    }

    createTable() {
        this.HTMLTable = document.createElement('table');
        this.HTMLTable.className = 'table table-main';
        this.HTMLWrapper.appendChild(this.HTMLTable);
    }

    createFakeTable() {
        this.fakeTable = document.createElement('table');
        this.fakeTable.className = 'table table-main table-sticky';
        this.HTMLWrapper.appendChild(this.fakeTable);
    }

    createHeader(headerData) {
        this.header = new Header({
            table: this.HTMLTable,
            rows: headerData
        })
        new Header({
            table: this.fakeTable,
            rows: headerData
        })
    }

    createBody(bodyData) {
        this.body = new Body({
            table: this.HTMLTable,
            rows: bodyData
        })

        new Body({
            table: this.fakeTable,
            rows: bodyData
        })

        ControlButtons.initializeInvisibleButtons();
    }

    insertAddButton(container) {
        ControlButtons.createAddButton({
            cellHTML: container,
            tableController: this
        })
    }

    updateBody(newData, addFn) {
        this.currentData = newData;
        if(this.dataTransformator) {
            const transformedData = this.dataTransformator(newData);
            this.body.updateBody(transformedData, addFn);
        } else {
            this.body.updateBody(newData, addFn);
        }
    }

    getRowPattern() {
        return this.header.rowPattern;
    }

    setDataTransformator(fn) {
        this.dataTransformator = fn;
    }
}