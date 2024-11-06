const api = import.meta.env.VITE_BASE_URL;

const headers = () => {
    return {"Content-Type": "application/json", "X-Custom-Authorization": "Bearer " + window.token}
}
const getHeaders = () => {
    return {"X-Custom-Authorization": "Bearer " + window.token}
}


export async function get<T>(url: string, mapper?: (r: any) => T): Promise<T> {
    return fetch(api + url, {
        headers: getHeaders()
    })
        .then(async response => {
            if (!response.ok) {
                throw {
                    error: (await response.json()).error,
                    code: response.status
                };
            }
            if (mapper) return mapper(await response.json());
            return (await response.json());
        });
}

export async function post(url: string, body: any): Promise<any> {
    return fetch(api + url, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(body)
    }).then(handleResponse())
}

export async function patch(url: string, body: any): Promise<any> {
    return fetch(api + url, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify(body)
    }).then(handleResponse())
}

export async function del(url: string): Promise<any> {
    return fetch(api + url, {
        method: "DELETE",
        headers: headers(),
    }).then(handleResponse())
}

function handleResponse(): ((value: Response) => any) | null | undefined {
    return async (response) => {
        if (!response.ok) {
            throw {
                error: (await response.json()).error,
                code: response.status
            };
        }
        if (response.status === 204) return;
        return (await response.json());
    };
}

export type HttpError = {
    error: string,
    code: number
}