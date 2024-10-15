import {assign, createMachine, fromPromise} from "xstate";
import type {Task, Tasks, TasksList} from '@/types/types'
import {
    canCarryTask,
    getNextTaskId,
    tasksAreEmpty,
    tasksAreFull,
    tasksHaveBeenCarried
} from '@/state-machines/tasks.extensions'
import {TasksListMachineStates, TasksMachineStates,} from "@/state-machines/tasks.states";
import {createTasksList, updateTasksList} from "@/apis/tasks_list.api";

export const taskLimit = 22;

export const tasksMachine = createMachine(
    {
        types: {} as {
            context: { id: string; name: string; tasks: Tasks, tasksLists: TasksList[] };
        },
        context: {id: "", name: "", tasks: [], tasksLists: [] as TasksList[]},
        on: {
            reset: {
                target: `.${TasksListMachineStates.empty}`,
                actions: assign({id: "", name: "", tasks: [], tasksLists: [] as TasksList[]})
            }
        },
        initial: TasksListMachineStates.empty,
        states: {
            empty: {
                on: {
                    readyToAddFirstTaskList: {
                        target: TasksListMachineStates.readyToAddTasksLists,
                    },
                },
                always: {
                    guard: "tasksListsExist",
                    target: TasksListMachineStates.addingTasksLists,
                },
            },
            readyToAddTasksLists: {
                on: {
                    addTasksList: {
                        target: TasksListMachineStates.creatingTheTasksList,
                    },
                },
            },
            creatingTheTasksList: {
                invoke: {
                    input: ({event}) => ({name: event.name}),
                    src: fromPromise(async ({input: {name}}) => await createTasksList(name)),
                    onDone: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: assign({
                            id: ({context, event}) => (context.name = event.output.id),
                            name: ({context, event}) => (context.name = event.output.name),
                            tasksLists: ({context, event}) => context.tasksLists.concat({
                                id: event.output.id,
                                name: event.output.name
                            }),
                        }),
                    },
                },
            },
            updatingTheTasksList: {
                invoke: {
                    input: ({event}) => ({id: event.id, name: event.name}),
                    src: fromPromise(async ({input: {id, name}}) => await updateTasksList(id, name)),
                    onDone: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: assign({
                            name: ({context, event}) => (context.name = event.output.name),
                            tasksLists: ({context, event}) => context.tasksLists.map((list) => {
                                if (list.id === event.output.id) {
                                    list.name = event.output.name;
                                }
                                return list;
                            })
                        }),
                    },
                },
            },
            addingTasksLists: {
                initial: TasksMachineStates.empty,
                on: {
                    addTasksList: {
                        target: TasksListMachineStates.creatingTheTasksList,
                    },
                    updateTasksList: {
                        target: TasksListMachineStates.updatingTheTasksList,
                    },
                    selectTasksList: {
                        actions: assign({
                            id: ({context, event}) => {
                                if (context.tasksLists.find((list) => list.id === event.id) === undefined) return context.id;
                                return (context.id = event.id)
                            },
                            name: ({context, event}) => {
                                const name = context.tasksLists.find((list) => list.id === event.id)?.name;
                                if (name === undefined) return context.name;
                                return (context.name = name)
                            },
                            tasks: ({context}) => (context.tasks = []),
                        }),
                        target: TasksListMachineStates.assessingTasksList,
                    },
                },
                states: {
                    empty: {
                        on: {
                            readyToAddFirstTask: {
                                target: TasksMachineStates.addingTasks,
                            },
                        },
                        always: {
                            guard: "tasksAreEmpty",
                            target: TasksMachineStates.addingTasks,
                        },
                    },
                    addingTasks: {
                        on: {
                            add: {
                                actions: assign({
                                    tasks: ({context, event}) =>
                                        context.tasks.concat({
                                            id: getNextTaskId(context.tasks),
                                            content: event.content,
                                            carried: false,
                                            page: 0,
                                            ticked: false
                                        }),
                                }),
                            },
                            tick: {
                                actions: assign({
                                    tasks: ({context, event}) => {
                                        const task = context.tasks.find((task) => task.id === event.id) ?? ({} as Task);
                                        task.ticked = true;
                                        return context.tasks;
                                    },
                                }),
                            },
                        },
                        always: {
                            guard: "tasksAreFull",
                            target: TasksMachineStates.choosingTasksToCarry,
                        },
                    },
                    choosingTasksToCarry: {
                        on: {
                            carry: {
                                actions: assign({
                                    tasks: ({context, event}) => {
                                        const task = context.tasks.find((task) => task.id === event.id) ?? ({} as Task);
                                        if (canCarryTask(task)) {
                                            task.page += 1;
                                            task.carried = true;
                                        }
                                        return context.tasks;
                                    },
                                }),
                            },
                            remove: {
                                actions: assign({
                                    tasks: ({context, event}) => {
                                        context.tasks = context.tasks.filter((task) => task.id !== event.id,);
                                        return context.tasks;
                                    },
                                }),
                            },
                        },
                        always: {
                            guard: "tasksHaveAllBeenCarried",
                            target: TasksMachineStates.addingTasks,
                        },
                        exit: [
                            (context) => {
                                context.context.tasks = context.context.tasks.filter((task) => !task.ticked).map((task) => {
                                    task.carried = false;
                                    return task;
                                });
                            },
                        ],
                    },
                },
            },
            assessingTasksList: {
                always: {
                    target: TasksListMachineStates.addingTasksLists,
                },
            },
            success: {
                always: {
                    target: TasksListMachineStates.addingTasksLists
                },
            },
        },
    },
    {
        guards: {
            tasksHaveAllBeenCarried: ({context}) => {
                return tasksHaveBeenCarried(context);
            },
            tasksAreFull: ({context}) => {
                return tasksAreFull(context);
            },
            tasksListsExist: ({context}) => {
                return context.id !== "";
            },
            tasksAreEmpty: ({context}) => {
                return !tasksAreEmpty(context);
            },
        },
    },
);