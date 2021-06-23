import {getHeaders, getBodyRows} from "./TableGenerator/utils/transfromData";
import {conf, data} from "./TableGenerator/utils/mockData";

import {TableGenerator} from "./TableGenerator/TableGenerator";
import {mirageServer} from "./api/mirage";
import {getAllData} from "./api/api";

window.conf = conf;
window.data = data;
window.save = '/api/save';
window.edit = '/api/edit';
window.delete = '/api/delete';

if (process.env.NODE_ENV === "development") {
    mirageServer();
}

document.body.onload =async () => {
    await getAllData();
    createTable('root');
}

export function createTable(id) {
    const headerRows = getHeaders(window.conf);
    const table = new TableGenerator({
        container: document.getElementById(id),
        headerData: headerRows,
    });

    const bodyRows = getBodyRows(data, table.getRowPattern(), table);
    table.currentData = window.data;
    table.createBody(bodyRows);
    table.setDataTransformator((newData) => getBodyRows(newData, table.getRowPattern(), table));
    table.initDatatables(table.HTMLWrapper);
}