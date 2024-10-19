import {get, patch, post} from '@/common/http'
import type {TasksList} from "@/types/types";

export const getTasksLists = async () => {
    return await get<TasksList[]>(`/tasks-lists`);
}

export const addTasksList = async (name: any) => {
    const response = await post(`/tasks-lists`, {name});
    return {
        id: response.id,
        name: name
    }
}

export const updateTasksList = async (id: any, name: any) => {
    const response = await patch(`/tasks-lists/${id}`, {name});
    return {
        ...(response),
        id,
        name
    }
}

export const addTask = async (tasksListId: any, content: any) => {
    const response = await post(`/tasks-lists/${tasksListId}/task`, {content});
    return {
        id: response.id,
        content
    }
}

export const tickTask = async (tasksListId: any, taskId: any) => {
    const response = await patch(`/tasks-lists/${tasksListId}/task/${taskId}/tick`, {});
    return {
        ...(response),
        taskId: taskId
    }
}
