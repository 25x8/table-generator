const BASE_URL = window.host;

async function getResource(url, init = {}) {

    init['headers'] = new Headers({
        'Content-Type': 'application/json'
    })


    try {
        const res = await fetch(`${url}`, init);
        return await res.json();
    } catch (e) {
        console.error(e)
        alert('Ошибка изменения данных')
    }


}

export async function getAllData() {
    return await getResource('/api/datum')
}

export async function saveData(data) {
    const init = {
        method: 'POST',
        body: JSON.stringify(data)
    }
    return await getResource(window.save, init);
}

export async function editData(id, data) {
    const init = {
        method: 'POST',
        body: JSON.stringify(data)
    }
    return await getResource(`${window.edit}/${id}`, init);
}

export async function deleteDataTable(id) {
    const init = {
        method: 'DELETE'
    }
    return await getResource(`${window.delete}/${id}`, init);
}