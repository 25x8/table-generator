import {Header} from "./Header/Header";
import {Body} from "./Body/Body";
import "./table.scss";

export class TableGenerator {
    HTMLWrapper;
    HTMLTable;
    header;
    body;
    rowTransformator;

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
        this.HTMLTable.classList.add('table-main');
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

    updateBody(newData) {
        if(this.rowTransformator) {
            const transformedData = this.rowTransformator(newData);
            this.body.updateBody(transformedData);
        } else {
            this.body.updateBody(newData);
        }
    }

    getRowPattern() {
        return this.header.rowPattern;
    }

    setDataTransformator(fn) {
        this.rowTransformator = fn;
    }
}