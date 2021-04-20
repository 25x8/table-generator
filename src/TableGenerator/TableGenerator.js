import {Header} from "./Header/Header";
import {Body} from "./Body/Body";
import "./table.scss";
import {createAddButton} from "./utils/controlButtons";

export class TableGenerator {
    HTMLWrapper;
    HTMLTable;
    header;
    body;
    dataTransformator;
    currentData;

    constructor({container, headerData}) {
        this.createWrapper(container);
        this.createTable();
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

    createHeader(headerData) {
        this.header = new Header({
            table: this.HTMLTable,
            rows: headerData
        })
    }

    createBody(bodyData) {
        this.body = new Body({
            table: this.HTMLTable,
            rows: bodyData
        })
    }

    insertAddButton(container) {
        createAddButton(container, this.currentData, this)
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