const api = import.meta.env.VITE_BASE_URL;

export async function get<T>(url: string): Promise<T | HttpError> {
    return await fetch(api + url)
        .then(response => response.json())
        .catch(error => {
            error.error;
            error.code;
        });
}

export async function post(url: string, body: any): Promise<any | HttpError> {
    return await fetch(api + url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .catch(error => {
            error.error;
            error.code;
        });
}

export async function patch(url: string, body: any): Promise<any | HttpError> {
    return await fetch(api + url, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .catch(error => {
            error.error;
            error.code;
        });
}

export type HttpError = {
    error: string;
    code: number;
}
