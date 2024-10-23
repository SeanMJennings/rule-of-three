const api = import.meta.env.VITE_BASE_URL;

export async function get<T>(url: string, mapper?: (r: any) => T): Promise<T> {
    return fetch(api + url)
        .then(async response => {
            if (!response.ok) {
                throw  {
                    error: response.json(),
                    code: response.status
                };
            }
            if (mapper) return mapper(await response.json());
            return response.json();
        });
}

export async function post(url: string, body: any): Promise<any> {
    return fetch(api + url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    }).then(handleResponse())
}

export async function patch(url: string, body: any): Promise<any> {
    return fetch(api + url, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    }).then(handleResponse())
}

export async function del(url: string): Promise<any> {
    return fetch(api + url, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
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
        return response.json();
    };
}