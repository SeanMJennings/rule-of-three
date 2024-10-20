import {get, patch, post} from '@/common/http'
import type {TasksList} from "@/types/types";

export const getTasksLists = async () => {
    return await get<TasksList[]>(`/tasks-lists`, taskListApiMapper);
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

export const removeTask = async (tasksListId: any, taskId: any) => {
    const response = await patch(`/tasks-lists/${tasksListId}/task/${taskId}/remove`, {});
    return {
        ...(response),
        taskId: taskId
    }
}

export const carryTask = async (tasksListId: any, taskId: any) => {
    const response = await patch(`/tasks-lists/${tasksListId}/task/${taskId}/carry`, {});
    return {
        ...(response),
        taskId: taskId
    }
}

const taskListApiMapper = (taskList: any[]) => {
    return taskList.map((taskList) => {
        return {
            id: taskList.id,
            name: taskList.name,
            tasks: taskList.tasks.map((task: any) => {
                return {
                    id: task.id,
                    content: task.content,
                    carried: task.is_carried,
                    removed: task.is_removed,
                    ticked: task.is_ticked,
                    page: task.page_count
                }
            })
        }
    });
}