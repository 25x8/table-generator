import {getHeaders, getBodyRows} from "./TableGenerator/utils/transfromData";
import {conf, data} from "./TableGenerator/utils/mockData";

import {TableGenerator} from "./TableGenerator/TableGenerator";

document.body.onload = () => {
    const headerRows = getHeaders(conf);
    const table = new TableGenerator({
        container: document.getElementById('root'),
        headerData: headerRows,
    });



    const bodyRows = getBodyRows(data, table.getRowPattern(), table);
    table.createBody(bodyRows);
    table.setDataTransformator((newData) => getBodyRows(newData, table.getRowPattern(), table));
    table.insertAddButton(document.querySelector('th[self-id="control"]'));

}