const BASE_URL = window.host;

async function getResource(url, init = {}) {

    init['headers'] = new Headers({
        'Content-Type': 'application/json'
    })

    const res = await fetch(`${BASE_URL}${url}`, init);

    if (!res.ok) {
        return {
            status: res.status
        };
    }

    if(res.status === 204) {
        return {success: 'success'}
    }

    return await res.json();
}


export async function saveData(data) {
    const init = {
        method: 'POST',
        body: JSON.stringify(data)
    }
    return await getResource(`/api/data`, init);
}

export async function editData(id, data) {
    const init = {
        method: 'POST',
        body: JSON.stringify(data)
    }
    return await getResource(`/api/data/${id}`, init);
}

export async function deleteDataTable(id) {
    const init = {
        method: 'DELETE'
    }
    return await getResource(`/api/data/${id}`, init);
}