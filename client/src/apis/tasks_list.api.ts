﻿import {del, get, patch, post} from '@/common/http'
import type {Task, TasksList} from "@/types/types";

export const getTasksLists = async () => {
    return get<TasksList[]>(`/tasks-lists`, taskListApiMapper);
}

export const addTasksList = async (name: any) => {
    return post(`/tasks-lists`, {name}).then((response) => mapApiTasksList(response));
}

export const updateTasksList = async (id: any, name: any) => {
    return patch(`/tasks-lists/${id}`, {name})
        .then(() => {
            return {
                id,
                name
            }
    });
}

export const deleteTasksList = async (id: any) => {
    return del(`/tasks-lists/${id}`)
        .then(() => {
            return {
                id
            }
    });
}

export const updateLastSelectedTime = async (id: any) => {
    return patch(`/tasks-lists/${id}/last-selected-time`, {})
        .then(() => {
            return {
                id
            }
    });
}

export const shareTasksList = async (id: any, share_with: any) => {
    return patch(`/tasks-lists/${id}/share`, {share_with})
        .then(() => {
            return {
                id,
                email: share_with
            }
    });
}

export const unshareTasksList = async (id: any, unshare_with: any) => {
    return patch(`/tasks-lists/${id}/unshare`, {unshare_with})
        .then(() => {
            return {
                id,
                email: unshare_with
            }
    });
}

export const unshareTasksListForSelf = async (id: any) => {
    return patch(`/tasks-lists/${id}/unshare-self`, {})
        .then(() => {
            return {
                id
            }
    });
}

export const addTask = async (tasksListId: any, content: any) => {
    return post(`/tasks-lists/${tasksListId}/task`, {content})
        .then((response) => {
            return {
                id: response.id,
                content
            }
    });
}

export const tickTask = async (tasksListId: any, taskId: any) => {
    return patch(`/tasks-lists/${tasksListId}/task/${taskId}/tick`, {})
        .then(() => {
            return {
                taskId
            }
    });
}

export const removeTask = async (tasksListId: any, taskId: any) => {
    return patch(`/tasks-lists/${tasksListId}/task/${taskId}/remove`, {})
        .then(() => {
            return {
                taskId
            }
    });
}

export const carryTask = async (tasksListId: any, taskId: any) => {
    return patch(`/tasks-lists/${tasksListId}/task/${taskId}/carry`, {})
        .then(() => {
            return {
                taskId
            }
    });
}

export const mapApiTask = (task: apiTask): Task => {
    return {
        id: task.id,
        content: task.content,
        carried: task.is_carried,
        removed: task.is_removed,
        ticked: task.is_ticked,
        page: task.page_count,
    };
};

export const mapApiTasks = (theApiTasks: apiTask[]) => {
    return theApiTasks.map(mapApiTask);
}

export const mapApiTasksList = (theApiTasksList: apiTasksList) => {
    return {
        id: theApiTasksList.id,
        name: theApiTasksList.name,
        lastSelectedTime: theApiTasksList.last_selected_time,
        ownerEmail: theApiTasksList.owner_email,
        sharedWith: theApiTasksList.shared_with,
        tasks: mapApiTasks(theApiTasksList.tasks)
    }
}

export const mapApiTasksLists = (theApiTasksLists: apiTasksList[]) => {
    return theApiTasksLists.map(mapApiTasksList);
}

export type apiTask = {
    id: string,
    content: string,
    is_carried: boolean,
    is_removed: boolean,
    is_ticked: boolean,
    page_count: number,
}

export type apiTasksList = {
    id: string,
    name: string,
    last_selected_time: string,
    owner_email: string,
    shared_with: string[],
    tasks: apiTask[]
}

const taskListApiMapper = (taskLists: any[]) => {
    return mapApiTasksLists(taskLists).sort((a,b) => {
        return new Date(b.lastSelectedTime ?? '').getTime() - new Date(a.lastSelectedTime ?? '').getTime()
    })
}