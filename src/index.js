import {getHeaders, getBodyRows} from "./TableGenerator/utils/transfromData";
import {conf, data} from "./TableGenerator/utils/mockData";

import {TableGenerator} from "./TableGenerator/TableGenerator";
import {mirageServer} from "./api/mirage";


window.conf = conf;
window.data = data;
window.save = '/api/add';
window.edit = '/api/edit';
window.delete = '/api/delete';

if (process.env.NODE_ENV === "development") {
    mirageServer();
}

document.body.onload =async () => {
    createTable({
        tableWrapId: 'root',
        addBtnId: 'addRow',
        api: {
          create: '/api/add',
          edit: '/api/edit',
          remove: '/api/delete',
        },
        data: data,
        conf: conf
    });
}

export function createTable({tableWrapId, addBtnId, api, conf, data}) {

    window.add = api.create;
    window.edit = api.edit;
    window.delete = api.remove;

    const headerRows = getHeaders(conf);
    const table = new TableGenerator({
        container: document.getElementById(tableWrapId),
        headerData: headerRows,
        addBtnId
    });

    const bodyRows = getBodyRows(data, table.getRowPattern(), table);
    table.currentData = data;
    table.createBody(bodyRows);
    table.setDataTransformator((newData) => getBodyRows(newData, table.getRowPattern(), table));
    table.initDatatables(table.HTMLWrapper);
}