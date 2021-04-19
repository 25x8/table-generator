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

    initRows(rows) {
        this.rowCount = 0;
        const rowsArray = Object.values(rows);

        rowsArray.forEach((row, index) => {
            this.addRow(row);
        });
    }



    addRow(row) {
        this.rowCount++;
        const HTMLRow = document.createElement('tr');
        HTMLRow.setAttribute('row-count', `${this.rowCount}`);
        this.HTMLBody.appendChild(HTMLRow);

        row.forEach((cell, index) => {
            const newCell = document.createElement('td');
            const lastCell = index === row.length - 1
            lastCell
                ? newCell.setAttribute('row-count', `${this.rowCount}`)
                : newCell.setAttribute('data-cell', 'true')

            if (typeof cell === 'function') {
                cell(newCell);
            } else {
                newCell.textContent = cell;
            }
            HTMLRow.appendChild(newCell);
        })
    }

    updateBody(newRows) {
        this.HTMLBody.innerHTML = '';
        this.initRows(newRows)
    }

}