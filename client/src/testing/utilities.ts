export const reducedTaskLimit = 5;

export function waitUntil(condition_function: () => boolean) {
    const poll = (resolve: any) => {
        if (condition_function()) resolve()
        else setTimeout(_ => poll(resolve), 400);
    }

    return new Promise(poll);
}