export const createTasksList = (name: any) => {
    console.log(name)
    throw new Error(name)
}


const search = (query: string) =>
    new Promise((resolve, reject) => {
        if (!query.length) {
            return reject('No query specified');
            // or:
            // throw new Error('No query specified');
        }

        return resolve(getSearchResults(query));
    });