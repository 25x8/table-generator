import regeneratorRuntime from "regenerator-runtime";
import {ControlButtons} from "../ControlButtons/ControlButtons";


/* =======HEADER DATA======== */

export function getHeaders(data) {
    let firstRow = [];
    let secondRow = [];
    let thirdRow = [];

    const characteristicHeader = setCharacteristicRow(data.characteristics);
    secondRow = [...secondRow, ...characteristicHeader.secondRow];
    thirdRow = [...thirdRow, ...characteristicHeader.thirdRow];
    firstRow.push({
        id: 'characteristics',
        label: 'Характеристики',
        colspan: characteristicHeader.colspanFirstRow
    });

    const inputsHeader = setInputsRows(data.inputs, data.grades);
    firstRow = [...firstRow, ...inputsHeader.firstRow];
    secondRow = [...secondRow, ...inputsHeader.secondRow];
    thirdRow = [...thirdRow, ...inputsHeader.thirdRow];

    firstRow.push({
        id: 'control',
        label: 'Управление',
        rowspan: 3
    })


    return {
        firstRow,
        secondRow,
        thirdRow
    }
}

function setInputsRows(inputs, grades) {
    const firstRow = [];
    const secondRow = [];
    let thirdRow = [];


    grades.forEach((grade) => {
        let colspanFirstRow = 0;

        inputs.forEach(input => {
            const colspan = !input.measure ? 3 : 4
            colspanFirstRow += colspan;

            secondRow.push({
                parentId: grade.id,
                id: `${input.id}-${grade.id}`,
                label: input.label,
                colspan
            });

            thirdRow = [...thirdRow, ...setInputHeader(`${input.id}-${grade.id}`, input.dict ? input.options : null, input.measure)];
        })

        firstRow.push({
            id: grade.id,
            label: grade.label,
            colspan: colspanFirstRow
        })
    })

    return {
        firstRow,
        secondRow,
        thirdRow
    }
}

function setCharacteristicRow(data) {
    const secondRow = [];
    let thirdRow = [];
    let colspanFirstRow = 0;


    data.forEach(({label, id, dict, options, measure}) => {

        const colspan = !measure ? 3 : 4

        colspanFirstRow += colspan

        secondRow.push({
            id,
            label,
            colspan,
            parentId: 'characteristics'
        });

        thirdRow = [...thirdRow, ...setInputHeader(id, dict ? options : null, measure)];

    });

    return {
        secondRow,
        thirdRow,
        colspanFirstRow
    }
}

function setInputHeader(parentId, options, measure) {

    const defaultInput = [
        {
            parentId,
            id: `min`,
            label: '<',
            options
        },
        {
            parentId,
            id: `max`,
            label: '>',
            options
        },
        {
            parentId,
            id: `eq`,
            label: '=',
            options
        }
    ];

    measure && defaultInput.push({
        parentId,
        id: `measure`,
        label: 'ЕИ',
        measureVal: measure
    })

    return defaultInput;
}

/* =======BODY DATA======== */

export function getBodyRows(data, rowsPattern, tableObject) {

    const rows = [];

    data.forEach(rowData => {
        const row = [];
        rowsPattern.forEach(pattern => {

            const dataType = pattern[0];

            let cellData = null;

            let dataObject = {};
            if (dataType === 'characteristics') {
                dataObject = rowData['characteristics'].filter(el => {
                    return el.id === pattern[1]
                })[0];
            } else {
                dataObject = rowData['rules'].filter(el => {
                    return `${el.id}-${el.grade}` === pattern[1]
                })[0];

            }



            if (pattern[2] === 'measure') {
                const measureCell = document.querySelector(`[parent-id="${pattern[1]}"][self-id="measure"]`)
                cellData = measureCell.getAttribute('measure-val')
                cellData = createSelect(
                    cellData.split(','),
                    measureCell.getAttribute('measure-id').split(','),
                    dataObject['measure']
                );

            } else {
                const optionCell = document.querySelector(`[parent-id="${pattern[1]}"][self-id="${pattern[2]}"]`)
                cellData = optionCell.getAttribute('option-val');
                if(cellData) {
                    cellData = createSelect(
                        cellData.split(','),
                        optionCell.getAttribute('option-id').split(','),
                        dataObject[pattern[2]]
                    )
                } else {
                    cellData = dataObject[pattern[2]];
                }
            }
            row.push({
                cellData,
                dataType
            })

        });

        row.push(({tr, cell}) => {
            const controlButtons = new ControlButtons({
                tableController: tableObject,
                rowHTML: tr
            });

            controlButtons.createControlGroup({
                cellHTML: cell,
                id: rowData.id
            });

            return controlButtons;
        });

        rows.push(row);

    });

    return rows;
}

function createSelect(options, idList, measure) {
    const select = document.createElement("select");
    let selected = false

    options.forEach((el, index) => {
        if(el !== '') {
            const opt = document.createElement("option");

            opt.value = el ? idList[index] : -1;
            opt.text = el;

            select.add(opt, null);


            if (+opt.value === +measure) {
                opt.setAttribute('selected', 'selected');
                selected = true;
            }

            select.setAttribute('disabled', 'disabled');
        }
    })

    if(!selected) {
        $(select).val(-1).change()
    }

    return select
}



