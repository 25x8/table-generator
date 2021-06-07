import {Header} from "./Header/Header";
import {Body} from "./Body/Body";
import {ControlButtons} from "./ControlButtons/ControlButtons";
import dtRussian from './utils/dtRussian.json'
import 'datatables.net/js/jquery.dataTables.min';


import 'datatables.net-buttons/js/dataTables.buttons.min';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.min.css';
import 'datatables.net-fixedheader/js/dataTables.fixedHeader.min';
import 'datatables.net-fixedheader-dt/css/fixedHeader.dataTables.min.css';
import "./table.scss";


export class TableGenerator {
    HTMLWrapper;
    HTMLTable;
    datatablesWrapper;
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
        this.HTMLTable.setAttribute('width', '100%');
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

    initDatatables() {

        const tableController = this;
        this.datatablesWrapper = $(this.HTMLTable).DataTable({
            dom: 'lBfrtip',
            fixedHeader: true,
            order: [1, 'asc'],
            language: dtRussian,
            buttons: [
                {
                    text: '<i class="bi bi-plus-lg"></i>',
                    action: function () {
                        ControlButtons.createAddRow(tableController);
                    }
                }
            ]
        })
    }
}