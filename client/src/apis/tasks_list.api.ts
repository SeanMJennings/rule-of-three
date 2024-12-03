import {del, get, patch, post} from '@/common/http'
import type {TasksList} from "@/types/types";

export const getTasksLists = async () => {
    return get<TasksList[]>(`/tasks-lists`, taskListApiMapper);
}

export const addTasksList = async (name: any) => {
    return post(`/tasks-lists`, {name});
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

const taskListApiMapper = (taskList: any[]) => {
    return taskList.map((taskList) => {
        return {
            id: taskList.id,
            name: taskList.name,
            last_selected_time: taskList.last_selected_time,
            tasks: taskList.tasks.map((task: any) => {
                return {
                    id: task.id,
                    content: task.content,
                    carried: task.is_carried,
                    removed: task.is_removed,
                    ticked: task.is_ticked,
                    page: task.page_count,
                }
            })
        }
    }).sort((a,b) => {
        return new Date(b.last_selected_time ?? '').getTime() - new Date(a.last_selected_time ?? '').getTime()
    })
}