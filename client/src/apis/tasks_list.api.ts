import {get, patch, post} from '@/common/http'
import type {TasksList} from "@/types/types";

export const getTasksLists = async () => {
    return await get<TasksList[]>(`/tasks-lists`);
}

export const addTasksList = async (name: any) => {
    let response = await post(`/tasks-lists`, {name});
    return {
        id: response.id,
        name: name
    }
}

export const updateTasksList = async (id: any, name: any) => {
    let response = await patch(`/tasks-lists/${id}`, {name});
    return {
        ...(response),
        id,
        name
    }
}

export const addTask = async (tasksListId: any, task: any) => {
    return await post(`/tasks-lists/${tasksListId}/task`, task);
}
