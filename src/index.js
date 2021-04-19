import {getHeaders, getBodyRows} from "./TableGenerator/utils/transfromData";
import {conf, data} from "./TableGenerator/utils/mockData";

import {TableGenerator} from "./TableGenerator/TableGenerator";

document.body.onload = () => {
    const headerRows = getHeaders(conf);
    const table = new TableGenerator({
        container: document.getElementById('root'),
        headerData: headerRows,
    })



    const bodyRows = getBodyRows(data, table.getRowPattern(), table);
    table.createBody(bodyRows);
    table.setDataTransformator((newData) => getBodyRows(newData, table.getRowPattern(), table));
    table.insertAddButton(document.querySelector('th[self-id="control"]'));

    table.updateBody([
        {
            id: "42356",
            characteristics: [
                {
                    id: "weight",
                    min: 1,
                    max: 1,
                    eq: 2,
                },{
                    id: "length",
                    min: 3,
                    max: null,
                    eq: 3,
                }
            ],
            rules: [ //!отфильтровано по классам
                {
                    id: "inner_diameter",
                    min: null,
                    max: null,
                    eq: 50,
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
                    min: 100,
                    max: 199,
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
        },
        {
            id: "11",
            characteristics: [
                {
                    id: "weight",
                    min: 0,
                    max: 0,
                    eq: 0,
                },{
                    id: "length",
                    min: 0,
                    max: null,
                    eq: 0,
                }
            ],
            rules: [ //!отфильтровано по классам
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
                    min: 1,
                    max: null,
                    eq: null,
                    grade: "reject"
                },
            ]
        }
    ])
}