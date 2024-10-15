export const enum TasksListMachineStates {
    empty = "empty",
    readyToAddTasksLists = "readyToAddTasksLists",
    creatingTheTasksList = "creatingTheTasksList",
    updatingTheTasksList = "updatingTheTasksList",
    addingTasksLists = "addingTasksLists",
    assessingTasksList = "assessingTasksList",
}

export const enum TasksMachineStates {
    empty = "empty",
    addingTasks = "addingTasks",
    choosingTasksToCarry = "choosingTasksToCarry",
}

export const TasksMachineCombinedStates = {
    empty: TasksListMachineStates.empty,
    readyToAddTasksLists: TasksListMachineStates.readyToAddTasksLists,
    addingTasksListsEmpty: {addingTasksLists: TasksMachineStates.empty},
    addingTasksListsAddingTasks: {addingTasksLists: TasksMachineStates.addingTasks,},
    addingTasksListsChoosingTasksToCarry: {addingTasksLists: TasksMachineStates.choosingTasksToCarry,},
};
