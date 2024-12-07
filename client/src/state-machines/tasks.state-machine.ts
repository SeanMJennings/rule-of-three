import {type AnyEventObject, assign, createMachine, emit, fromPromise} from "xstate";
import type {TasksList} from '@/types/types'
import {
    tasksAreFull,
    tasksAreReadyForNewPage,
    tasksHaveBeenCarried,
} from '@/state-machines/tasks.extensions'
import {TasksListMachineStates, TasksMachineStates,} from "@/state-machines/tasks.states";
import {
    addTask,
    addTasksList,
    carryTask,
    deleteTasksList,
    getTasksLists,
    removeTask, shareTasksList,
    tickTask, unshareTasksList, unshareTasksListForSelf, updateLastSelectedTime,
    updateTasksList
} from "@/apis/tasks_list.api";
import type {HttpError} from "@/common/http";
import {
    createdTaskList, removeTaskList, selectNextId,
    taskListWithCarriedTask,
    taskListWithCreatedTask,
    taskListWithEmailAdded,
    taskListWithRemovedEmail, taskListWithRemovedTask,
    taskListWithTickedTask,
    taskListWithUpdatedName
} from "@/state-machines/tasks.state-machine.extensions";

export type TasksMachineContext = {
    id: string;
    tasksLists: TasksList[];
};

export type TasksMachineError = {
    type: string;
    error: string;
    code: number;
};

export type TasksMachineNestedContext = {
    context: TasksMachineContext;
};

export type TasksMachineContextAndEvent = {context: TasksMachineContext, event: AnyEventObject};

const assessingTasksExit = (context: TasksMachineNestedContext)=> {
    context.context.tasksLists.map((list) => {
        if (list.id === context.context.id && tasksAreReadyForNewPage(list)) {
            list.tasks = list.tasks.filter((task) => !task.ticked && !task.removed && (task.page <= 1 || (task.page == 2 && task.carried))).map((task) => {
                task.carried = false;
                return task;
            });
        }
        return list;
    });
}

export const tasksMachine = createMachine(
    {
        types: {} as {
            context: TasksMachineContext;
        },
        context: {id: '', tasksLists: [] as TasksList[]},
        initial: TasksListMachineStates.loading,
        on: {
            reset: {
                target: `.${TasksListMachineStates.loading}`,
                actions: assign({
                    id: ({context}) => (context.id = ''),
                    tasksLists: ({context}) => context.tasksLists = [] as TasksList[],
                }),
            }
        },
        states: {
            loading: {
                invoke: {
                    src: fromPromise(async () => await getTasksLists()),
                    onDone: {
                        target: TasksListMachineStates.empty,
                        actions: assign({
                            id: ({context, event}) => (context.id = event.output.length > 0 ? event.output[0].id : ''),
                            tasksLists: ({context, event}) => event.output.length > 0 ? context.tasksLists = event.output : context.tasksLists,
                        }),
                    },
                    onError: {
                        target: TasksListMachineStates.empty,
                        actions: emit(({ event }) => { return { type: 'error', error: (event.error as HttpError).error, code: (event.error as HttpError).code }})
                    }
                },
            },
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
                    src: fromPromise(async ({input: {name}}) => await addTasksList(name)),
                    onDone: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: assign({
                            id: ({context, event}) => (context.id = event.output.id),
                            tasksLists: createdTaskList(),
                        }),
                    },
                    onError: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: emit(({ event }) => { return { type: 'error', error: (event.error as HttpError).error, code: (event.error as HttpError).code }})
                    }
                },
            },
            updatingTheTasksList: {
                invoke: {
                    input: ({event}) => ({id: event.id, name: event.name}),
                    src: fromPromise(async ({input: {id, name}}) => await updateTasksList(id, name)),
                    onDone: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: assign({ tasksLists: taskListWithUpdatedName() }),
                    },
                    onError: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: emit(({ event }) => { return { type: 'error', error: (event.error as HttpError).error, code: (event.error as HttpError).code }})
                    }
                },
            },
            deletingTheTasksList: {
                invoke: {
                    input: ({context}) => ({id: context.id}),
                    src: fromPromise(async ({input: {id}}) => await deleteTasksList(id)),
                    onDone: {
                        target: TasksListMachineStates.empty,
                        actions: assign({ 
                            id: ({context, event }) => (context.id = context.tasksLists.length > 1 ? context.tasksLists.filter((list) => list.id !== event.output.id)[0]?.id : ''),
                            tasksLists: ({context, event}) => context.tasksLists.filter((list) => list.id !== event.output.id),
                        }),
                    },
                    onError: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: emit(({ event }) => { return { type: 'error', error: (event.error as HttpError).error, code: (event.error as HttpError).code }})
                    }
                },
            },
            selectingTheTasksList: {
                invoke: {
                    input: ({event}) => ({id: event.id}),
                    src: fromPromise(async ({input: {id}}) => await updateLastSelectedTime(id)),
                    onDone: {
                        target: TasksListMachineStates.assessingTasksList,
                        actions: assign({
                            id: ({context, event}) => {
                                if (context.tasksLists.find((list) => list.id === event.output.id) === undefined) return context.id;
                                return (context.id = event.output.id)
                            }
                        }),
                    },
                    onError: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: emit(({ event }) => { return { type: 'error', error: (event.error as HttpError).error, code: (event.error as HttpError).code }})
                    }
                },
            },
            sharingTheTasksList: {
                invoke: {
                    input: ({event}) => ({id: event.id, email: event.email}),
                    src: fromPromise(async ({input: {id, email}}) => await shareTasksList(id, email)),
                    onDone: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: assign({ tasksLists: taskListWithEmailAdded() }),
                    },
                    onError: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: emit(({ event }) => { return { type: 'error', error: (event.error as HttpError).error, code: (event.error as HttpError).code }})
                    }
                },
            },
            unsharingTheTasksList: {
                invoke: {
                    input: ({event}) => ({id: event.id, email: event.email}),
                    src: fromPromise(async ({input: {id, email}}) => await unshareTasksList(id, email)),
                    onDone: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: assign({ tasksLists: taskListWithRemovedEmail() }),
                    },
                    onError: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: emit(({ event }) => { return { type: 'error', error: (event.error as HttpError).error, code: (event.error as HttpError).code }})
                    }
                },
            },
            unsharingTheTasksListForSelf: {
                invoke: {
                    input: ({event}) => ({id: event.id}),
                    src: fromPromise(async ({input: {id}}) => await unshareTasksListForSelf(id)),
                    onDone: {
                        target: TasksListMachineStates.assessingTasksList,
                        actions: assign({id: selectNextId(), tasksLists: removeTaskList()}),
                    },
                    onError: {
                        target: TasksListMachineStates.addingTasksLists,
                        actions: emit(({event}) => {
                            return {
                                type: 'error',
                                error: (event.error as HttpError).error,
                                code: (event.error as HttpError).code
                            }
                        })
                    }
                }
            },
            addingTasksLists: {
                initial: TasksMachineStates.addingTasks,
                on: {
                    addTasksList: {
                        target: TasksListMachineStates.creatingTheTasksList,
                    },
                    updateTasksList: {
                        target: TasksListMachineStates.updatingTheTasksList,
                    },
                    deleteTasksList: {
                        target: TasksListMachineStates.deletingTheTasksList,
                    },
                    selectTasksList: {
                        target: TasksListMachineStates.selectingTheTasksList,
                    },
                    shareTasksList: {
                        target: TasksListMachineStates.sharingTheTasksList,
                    },
                    unshareTasksList: {
                        target: TasksListMachineStates.unsharingTheTasksList,
                    },
                    unshareTasksListForSelf: {
                        target: TasksListMachineStates.unsharingTheTasksListForSelf,
                    },
                },
                always: {
                    guard: "tasksListsAreEmpty",
                    target: TasksListMachineStates.readyToAddTasksLists,
                },
                states: {
                    addingTasks: {
                        on: {
                            add: {
                                target: TasksMachineStates.creatingTheTask,
                            },
                            tick: {
                                target: TasksMachineStates.tickingTheTask,
                            },
                        },
                        always: {
                            guard: "tasksAreFull",
                            target: TasksMachineStates.choosingTasksToCarry,
                        },
                    },
                    creatingTheTask: {
                        invoke: {
                            input: ({ context, event}) => ({id: context.id, content: event.content}),
                            src: fromPromise(async ({input: {id, content}}) => await addTask(id, content)),
                            onDone: {
                                target: TasksMachineStates.addingTasks,
                                actions: assign({ tasksLists: taskListWithCreatedTask() })
                            },
                            onError: {
                                target: TasksMachineStates.addingTasks,
                                actions: emit(({ event }) => { return { type: 'error', error: (event.error as HttpError).error, code: (event.error as HttpError).code }})
                            }
                        },
                    },
                    tickingTheTask: {
                        invoke: {
                            input: ({ context, event}) => ({id: context.id, taskId: event.id}),
                            src: fromPromise(async ({input: {id, taskId}}) => await tickTask(id, taskId)),
                            onDone: {
                                target: TasksMachineStates.addingTasks,
                                actions: assign({ tasksLists: taskListWithTickedTask() })
                            },
                            onError: {
                                target: TasksMachineStates.addingTasks,
                                actions: emit(({ event }) => { return { type: 'error', error: (event.error as HttpError).error, code: (event.error as HttpError).code }})
                            }
                        },
                    },
                    choosingTasksToCarry: {
                        on: {
                            carry: {
                                target: TasksMachineStates.carryingTheTask,
                            },
                            remove: {
                                target: TasksMachineStates.removingTheTask,
                            },
                            tick: {
                                target: TasksMachineStates.tickingTheTaskDuringChoosing,
                            },
                        },
                        always: {
                            guard: "tasksHaveAllBeenCarried",
                            target: TasksMachineStates.addingTasks,
                        },
                    },
                    removingTheTask: {
                        invoke: {
                            input: ({context, event}) => ({id: context.id, taskId: event.id}),
                            src: fromPromise(async ({input: {id, taskId}}) => await removeTask(id, taskId)),
                            onDone: {
                                target: TasksMachineStates.assessingTasks,
                                actions: assign({ tasksLists: taskListWithRemovedTask()})
                            },
                            onError: {
                                target: TasksMachineStates.choosingTasksToCarry,
                                actions: emit(({ event }) => { return { type: 'error', error: (event.error as HttpError).error, code: (event.error as HttpError).code }})
                            }
                        }
                    },
                    carryingTheTask: {
                        invoke: {
                            input: ({context, event}) => ({id: context.id, taskId: event.id}),
                            src: fromPromise(async ({input: {id, taskId}}) => await carryTask(id, taskId)),
                            onDone: {
                                target: TasksMachineStates.assessingTasks,
                                actions: assign({ tasksLists: taskListWithCarriedTask()})
                            },
                            onError: {
                                target: TasksMachineStates.choosingTasksToCarry,
                                actions: emit(({ event }) => { return { type: 'error', error: (event.error as HttpError).error, code: (event.error as HttpError).code }})
                            }
                        },
                    },
                    tickingTheTaskDuringChoosing: {
                        invoke: {
                            input: ({context, event}) => ({id: context.id, taskId: event.id}),
                            src: fromPromise(async ({input: {id, taskId}}) => await tickTask(id, taskId)),
                            onDone: {
                                target: TasksMachineStates.assessingTasks,
                                actions: assign({ tasksLists: taskListWithTickedTask() })
                            },
                            onError: {
                                target: TasksMachineStates.choosingTasksToCarry,
                                actions: emit(({ event }) => { return { type: 'error', error: (event.error as HttpError).error, code: (event.error as HttpError).code }})
                            }
                        },
                    },
                    assessingTasks: {
                        always: {
                            target: TasksMachineStates.addingTasks,
                        },
                        exit: [assessingTasksExit],
                    },
                },
            },
            assessingTasksList: {
                always: {
                    target: TasksListMachineStates.addingTasksLists,
                }
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
                return context.tasksLists.length > 0;
            },
            tasksListsAreEmpty: ({context}) => {
                return context.tasksLists.length === 0;
            }
        },
    },
);
