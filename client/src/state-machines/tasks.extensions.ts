import type {Task, TasksList} from '@/types/types'
import type {StateValue} from "xstate";
import {TasksMachineCombinedStates} from "@/state-machines/tasks.states";
import * as _ from "lodash";
export const taskLimit = Number(import.meta.env.TASK_LIMIT || 22);

export const readyToAddTasks = (value: StateValue) => {
    return (value !== TasksMachineCombinedStates.empty && value !== TasksMachineCombinedStates.readyToAddTasksLists);
};

export const showTickTasks = (value: StateValue) => {
    return _.isEqual(value, TasksMachineCombinedStates.addingTasksListsAddingTasks) || _.isEqual(value, TasksMachineCombinedStates.addingTasksListTickingTheTask);
};

export const tasksAreFull = function (context: { id: string, tasksLists: TasksList[]; }) {
    const numberOfTasks = context.tasksLists.find((list) => list.id === context.id)?.tasks.length;
    if (numberOfTasks === undefined) {
        return false;
    }
    return numberOfTasks >= taskLimit;
};

export const tasksAreEmpty = function (context: { id: string, tasksLists: TasksList[]; }) {
    return context.tasksLists.find((list) => list.id === context.id)?.tasks.length === 0;
};

export const tasksHaveBeenCarried = function (context: { id: string, tasksLists: TasksList[]; }): boolean {
    return context.tasksLists.find((list) => list.id === context.id)?.tasks.filter((n) => !n.carried && !n.ticked && !n.removed).length === 0;
};

export const tasksAreReadyForNewPage = function (tasksList: TasksList): boolean {
    return tasksList.tasks.filter((n) => n.carried || n.ticked || n.removed).length === taskLimit;
}

export const canCarryTask = function (task: Task): boolean {
    return task.page <= 1 && !task.ticked && !task.removed && !task.carried;
};

export const canRemoveTask = function (task: Task): boolean {
    return !task.carried && !task.ticked && !task.removed
}

export const getTasks = function (context: { id: string, tasksLists: TasksList[]; }): Task[] {
    return context.tasksLists.find((list) => list.id === context.id)?.tasks ?? [];
};

export const getName = function (context: { id: string, tasksLists: TasksList[]; }): string {
    return context.tasksLists.find((list) => list.id === context.id)?.name ?? '';
}
