import type {Task} from "@/types/types";
import type {AnyEventObject} from "xstate";
import type {TasksMachineContext, TasksMachineContextAndEvent} from "@/state-machines/tasks.state-machine";

export function createdTaskList() {
    return ({ context, event }: TasksMachineContextAndEvent) => context.tasksLists.concat({
        id: event.output.id,
        name: event.output.name,
        tasks: event.output.tasks,
        lastSelectedTime: event.output.lastSelectedTime,
        ownerEmail: event.output.ownerEmail,
        sharedWith: event.output.sharedWith,
    });
}

export function taskListWithUpdatedName() {
    return ({ context, event }: TasksMachineContextAndEvent) => context.tasksLists.map((list) => {
        if (list.id === event.output.id) {
            list.name = event.output.name;
        }
        return list;
    });
}

export function taskListWithEmailAdded() {
    return ({ context, event }: TasksMachineContextAndEvent) => context.tasksLists.map((list) => {
        if (list.id === event.output.id) {
            list.sharedWith?.push(event.output.email);
        }
        return list;
    });
}

export function taskListWithRemovedEmail() {
    return ({ context, event }: TasksMachineContextAndEvent) => context.tasksLists.map((list) => {
        if (list.id === event.output.id) {
            list.sharedWith = list.sharedWith?.filter((email) => email !== event.output.email);
        }
        return list;
    });
}

export function removeTaskList() {
    return ({ context, event }: TasksMachineContextAndEvent) => context.tasksLists.filter((list) => list.id !== event.output.id);
}

export function taskListWithRemovedTask() {
    return ({ context, event }: TasksMachineContextAndEvent) => context.tasksLists.map((list) => {
        if (list.id === context.id) {
            const task = context.tasksLists.find((tasksList) => tasksList.id === context.id)?.tasks.find((task) => task.id === event.output.taskId) ?? ({} as Task);
            task.removed = true;
        }
        return list;
    });
}

export function taskListWithTickedTask() {
    return ({ context, event }: TasksMachineContextAndEvent) => context.tasksLists.map((list) => {
        if (list.id === context.id) {
            const task = context.tasksLists.find((tasksList) => tasksList.id === context.id)?.tasks.find((task) => task.id === event.output.taskId) ?? ({} as Task);
            task.ticked = true;
        }
        return list;
    });
}

export function taskListWithCreatedTask() {
    return ({ context, event }: TasksMachineContextAndEvent) => context.tasksLists.map((list) => {
        if (list.id === context.id) {
            list.tasks?.push({
                id: event.output.id,
                content: event.output.content,
                carried: false,
                removed: false,
                page: 0,
                ticked: false
            });
        }
        return list;
    });
}

export function taskListWithCarriedTask() {
    return ({ context, event } : {context: TasksMachineContext, event: AnyEventObject}) => context.tasksLists.map((list) => {
        if (list.id === context.id) {
            const task = context.tasksLists.find((tasksList) => tasksList.id === context.id)?.tasks.find((task) => task.id === event.output.taskId && task.page <= 1) ?? ({} as Task);
            task.carried = true;
            task.page += 1;
        }
        return list;
    });
}