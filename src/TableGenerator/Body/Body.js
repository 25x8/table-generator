import 'select2/dist/js/select2.full.min';
import 'select2/dist/css/select2.min.css';

export class Body {

    HTMLBody;
    rowCount = 0;

    constructor({table, rows}) {
        this.initHTML(table);
        this.initRows(rows);
    }

    initHTML(table) {
        this.HTMLBody = document.createElement('tbody');
        table.appendChild(this.HTMLBody);
    }

    initRows(rows, addFn) {
        this.rowCount = 0;
        const rowsArray = Object.values(rows);

        rowsArray.forEach((row, index) => {
            this.addRow(row, addFn, index, rowsArray.length - 1);
        });
    }

    addRow(row, addFn, rowCount, rowTotal) {
        this.rowCount++;
        const HTMLRow = document.createElement('tr');
        HTMLRow.setAttribute('row-count', `${this.rowCount}`);
        this.HTMLBody.appendChild(HTMLRow);

        row.forEach((cell, index) => {
            const newCell = document.createElement('td');
            newCell.setAttribute('cell-number', index)
            const lastCell = index === row.length - 1
            lastCell
                ? newCell.setAttribute('row-count', `${this.rowCount}`)
                : newCell.setAttribute('data-cell', 'true')

            if (typeof cell === 'function') {

               const controlButtons = cell({
                    tr: HTMLRow,
                    cell: newCell,
                });

               if(addFn) {
                   if (rowCount === rowTotal && addFn.index === -1) {
                       addFn.fn(controlButtons);
                   }

                   if (addFn.index === rowCount) {
                       addFn.fn(controlButtons);
                   }
               }

            } else {
                if(cell instanceof HTMLElement) {
                    newCell.append(cell);
                    $(cell).select2();
                } else {
                    newCell.textContent = cell;
                }

            }
            HTMLRow.appendChild(newCell);
        })
    }

    updateBody(newRows, addFn) {
        this.HTMLBody.innerHTML = '';
        this.initRows(newRows, addFn)
    }

}