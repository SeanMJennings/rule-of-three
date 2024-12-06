import {TasksListMachineStates, TasksMachineCombinedStates} from "@/state-machines/tasks.states";
import { forIn } from 'lodash'
import {expect} from 'vitest'
import {loading} from "@/state-machines/tasks.extensions";

const tasksListMachineStatesDictionary = [
    {key: TasksListMachineStates.empty, value: false},
    {key: TasksListMachineStates.loading, value: true},
    {key: TasksListMachineStates.readyToAddTasksLists, value: false},
    {key: TasksListMachineStates.creatingTheTasksList, value: true},
    {key: TasksListMachineStates.updatingTheTasksList, value: true},
    {key: TasksListMachineStates.deletingTheTasksList, value: true},
    {key: TasksListMachineStates.selectingTheTasksList, value: true},
    {key: TasksListMachineStates.sharingTheTasksList, value: true},
    {key: TasksListMachineStates.unsharingTheTasksList, value: true},
    {key: TasksListMachineStates.addingTasksLists, value: true},
    {key: TasksListMachineStates.assessingTasksList, value: false},
]

const tasksMachineCombinedStatesDictionary = [
    {key: "empty", value: false},
    {key: "readyToAddTasksLists", value: false},
    {key: "addingTasksListsCreatingTheTask", value: true},
    {key: "addingTasksListTickingTheTask", value: true},
    {key: "addingTasksListsAddingTasks", value: false},
    {key: "addingTasksListsChoosingTasksToCarry", value: false},
    {key: "addingTasksListsCarryingTheTask", value: true},
    {key: "addingTasksListsRemovingTheTask", value: true},
    {key: "addingTasksListsTickingTheTaskDuringChoosing", value: true},
    {key: "addingTasksListsAssessingTasks", value: false},
]

export function defines_each_state_as_loading_or_not()
{
    forIn(TasksListMachineStates, (value, key) => {
        inspect_loading_for_enum(key, value, tasksListMachineStatesDictionary);
    })
    forIn(TasksMachineCombinedStates, (value, key) => {
        inspect_loading_for_enum(key, value, tasksMachineCombinedStatesDictionary);
    })
}

function inspect_loading_for_enum(key: string, value: any, dictionary: { key: string, value: boolean }[]) {
    if (dictionary.find((state) => state.key === key) === undefined) {
        throw new Error(`State ${key} is not defined in the dictionary`);
    }
    else {
        const state = dictionary.find((state) => state.key === key);
        expect(state?.value, state?.key).toBe(loading(value));
    }
}
