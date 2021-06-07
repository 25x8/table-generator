export class Header {

    HTMLHeader;
    rowPattern = [];

    constructor({table, rows}) {
        this.initHTML(table);
        this.initRows(rows);
    }

    initHTML(table) {
        this.HTMLHeader = document.createElement('thead');
        table.appendChild(this.HTMLHeader);
    }

    initRows(rows) {

        const rowsArray = Object.values(rows);

        rowsArray.forEach((row, index) => {
            const lastRow = index === rowsArray.length - 1
            this.addRow(row, lastRow);
        });

    }

    addRow(row, lastRow) {
        const HTMLRow = document.createElement('tr');

        row.forEach(el => {
            const newCell = document.createElement('th');

            el.parentId && newCell.setAttribute('parent-id', el.parentId);
            el.colspan && newCell.setAttribute('colspan', el.colspan);
            el.rowspan && newCell.setAttribute('rowspan', el.rowspan);

            if(el.options) {
                let idOption = '';
                let valOption = '';

                el.options.forEach(val => {
                    idOption += `${val.id},`
                    valOption += `${val.value},`
                });

                newCell.setAttribute('option-id', idOption);
                newCell.setAttribute('option-val', valOption);
            }

            if(el.measureVal) {
                let idList = '';
                let valList = '';
                el.measureVal.forEach(val => {
                    idList += `${val.id},`
                    valList += `${val.value},`
                });
                newCell.setAttribute('measure-val', valList);
                newCell.setAttribute('measure-id', idList);
            }

            newCell.setAttribute('self-id', el.id);
            newCell.textContent = el.label;

            HTMLRow.append(newCell);

            lastRow && this.createDataPath(newCell);

        })
        this.HTMLHeader.appendChild(HTMLRow);
    }

    createDataPath(cell) {
        const path = [];
        getParent(cell);
        const pathAttr = path.reverse();

        pathAttr.push(cell.getAttribute('self-id'));

        this.rowPattern.push(pathAttr);

        cell.setAttribute('path', pathAttr)

        function getParent(cell) {
            const parent = cell.getAttribute('parent-id');
            if(parent) {
                path.push(parent);
                const parentCell = document.querySelector(`[self-id=${parent}]`)
                getParent(parentCell);
            }
        }

    }
}