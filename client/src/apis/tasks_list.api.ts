import {patch, post} from '@/common/http'

export const createTasksList = async (name: any) => {
    let response = await post(`/tasks-list`, {name});
    return {
        id: response.id,
        name: name
    }
}

export const updateTasksList = async (id: any, name: any) => {
    let response = await patch(`/tasks-list/${id}`, {name});
    return {
        ...(response),
        id,
        name
    }
}
