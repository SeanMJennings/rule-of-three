import type {Task, TasksList} from '@/types/types'
import type {StateValue} from "xstate";
import {TasksMachineCombinedStates} from "@/state-machines/tasks.states";
export const taskLimit = (import.meta.env.TASK_LIMIT as number) || 22;

export const ReadyToAddTasks = (value: StateValue) => {
    return (value !== TasksMachineCombinedStates.empty && value !== TasksMachineCombinedStates.readyToAddTasksLists);
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

export const canCarryTask = function (task: Task): boolean {
    return task.page <= 1 && !task.ticked;
};

export const getTasks = function (context: { id: string, tasksLists: TasksList[]; }): Task[] {
    return context.tasksLists.find((list) => list.id === context.id)?.tasks ?? [];
};

export const getName = function (context: { id: string, tasksLists: TasksList[]; }): string {
    return context.tasksLists.find((list) => list.id === context.id)?.name ?? '';
}
