import {tasksMachine} from "@/state-machines/tasks.state-machine";
import {afterEach, beforeEach, expect} from 'vitest'
import {type Actor, createActor} from 'xstate'
import {TasksListMachineStates, TasksMachineCombinedStates} from "@/state-machines/tasks.states";
import {MockServer} from "@/testing/mock-server";
import {reducedTaskLimit, waitUntil} from "@/testing/utilities";
import {getName, getTasks} from "@/state-machines/tasks.extensions";
import {mapApiTask, mapApiTasks, mapApiTasksList, mapApiTasksLists} from "@/apis/tasks_list.api";
import {task_list_id, task_list_name, another_task_list_id, another_task_list_name, add_task_list_response, another_add_task_list_response, task_id, task_ids, another_email_to_share, another_set_of_task_ids, new_task_list_name, add_task_list_response_with_tasks, email_to_share} from "@/state-machines/specs/tasks.api-mocks";

const mockServer = MockServer.New();
let tasks = {} as Actor<typeof tasksMachine>;


let wait_for_get_tasks_list: () => boolean;
let wait_for_create_tasks_list: () => boolean;

beforeEach(() => {
    mockServer.reset();
    wait_for_get_tasks_list = mockServer.get("/tasks-lists", [])
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", add_task_list_response)
    mockServer.start();
    tasks = createActor(tasksMachine);
    tasks.start();
});

afterEach(() => {
    tasks.send({type: "reset"})
});

function setupSingleGetTaskListWithTasksResponse() {
    wait_for_get_tasks_list = mockServer.get("/tasks-lists", [
        add_task_list_response_with_tasks
    ])
}

function setupMultipleGetTaskListResponse() {
    wait_for_get_tasks_list = mockServer.get("/tasks-lists", [
        add_task_list_response,
        another_add_task_list_response
    ])
}

export async function notifies_when_failing_to_load_a_task_list() {
    wait_for_get_tasks_list = mockServer.get("/tasks-lists", {
        error: "Failed to load tasks list",
    }, undefined, false)
    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    tasks.send({type: "reset"})
    await waitForLoadingToFinish();
    await waitUntil(wait_for_get_tasks_list)
    expect(the_error).toEqual({error: "Failed to load tasks list", type: "error", code: 422});
}

export async function loads_a_task_list() {
    setupSingleGetTaskListWithTasksResponse()
    tasks.send({type: "reset"})
    await waitForLoadingToFinish();
    await waitUntil(wait_for_get_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(tasks.getSnapshot().context.id).toEqual(task_list_id);
    expect(getName(tasks.getSnapshot().context)).toEqual(task_list_name);
    expect(getTasks(tasks.getSnapshot().context)).toEqual(mapApiTasks(add_task_list_response_with_tasks.tasks));
}

export async function loads_task_lists_in_order_of_last_selected_time() {
    setupMultipleGetTaskListResponse();
    tasks.send({type: "reset"})
    await waitForLoadingToFinish();
    await waitUntil(wait_for_get_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(tasks.getSnapshot().context.id).toEqual(another_task_list_id);
    expect(getName(tasks.getSnapshot().context)).toEqual(another_task_list_name);
    expect(getTasks(tasks.getSnapshot().context)).toEqual([]);
    expect(tasks.getSnapshot().context.tasksLists).toEqual([
        mapApiTasksList(another_add_task_list_response),
        mapApiTasksList(add_task_list_response)
    ]);
}

export async function adds_a_task_list() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(tasks.getSnapshot().context.id).toEqual(task_list_id);
    expect(getName(tasks.getSnapshot().context)).toEqual(task_list_name);
    expect(getTasks(tasks.getSnapshot().context)).toEqual([]);
}

export async function notifies_when_failing_to_add_a_task_list() {
    await waitForLoadingToFinish();
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {
        error: "Failed to add tasks list",
    }, false)
    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    expect(the_error).toEqual({error: "Failed to add tasks list", type: "error", code: 422});
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.readyToAddTasksLists);
}

export async function deletes_a_task_list() {
    setupSingleGetTaskListWithTasksResponse()
    tasks.send({type: "reset"})
    await waitForLoadingToFinish();
    await waitUntil(wait_for_get_tasks_list)
    const wait_for_delete_tasks_list = mockServer.delete(`/tasks-lists/${task_list_id}`)
    tasks.send({type: "deleteTasksList", id: task_list_id});
    await waitUntil(wait_for_delete_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.empty);
    expect(tasks.getSnapshot().context.id).toEqual('');
    expect(tasks.getSnapshot().context.tasksLists).toEqual([]);
}

export async function notifies_when_failing_to_delete_a_task_list() {
    setupSingleGetTaskListWithTasksResponse()  
    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    tasks.send({type: "reset"})
    await waitForLoadingToFinish();
    await waitUntil(wait_for_get_tasks_list)
    const wait_for_delete_tasks_list = mockServer.delete(`/tasks-lists/${task_list_id}`, { error: "Failed to delete task list" }, false)
    tasks.send({type: "deleteTasksList", id: task_list_id});
    await waitUntil(wait_for_delete_tasks_list)
    expect(the_error).toEqual({error: "Failed to delete task list", type: "error", code: 422});
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
}

export async function notifies_when_failing_to_update_a_task_list_name() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    const wait_for_update_tasks_list = mockServer.patch(`/tasks-lists/${task_list_id}`, { error: "Failed to update task list name"},false)
    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    tasks.send({type: "updateTasksList", id: task_list_id, name: new_task_list_name});
    await waitUntil(wait_for_update_tasks_list)
    expect(the_error).toEqual({error: "Failed to update task list name", type: "error", code: 422});
}

export async function adds_two_task_lists() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", another_add_task_list_response)
    tasks.send({type: "addTasksList", name: another_task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(tasks.getSnapshot().context.tasksLists).toEqual(mapApiTasksLists([add_task_list_response, another_add_task_list_response]));
}

export async function updates_a_task_list_name() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    const wait_for_update_tasks_list = mockServer.patch(`/tasks-lists/${task_list_id}`)
    tasks.send({type: "updateTasksList", id: task_list_id, name: new_task_list_name});
    await waitUntil(wait_for_update_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(tasks.getSnapshot().context.id).toEqual(task_list_id);
    expect(getName(tasks.getSnapshot().context)).toEqual(new_task_list_name);
    expect(getTasks(tasks.getSnapshot().context)).toEqual([]);
    expect(tasks.getSnapshot().context.tasksLists).toEqual(mapApiTasksLists([{
        ...add_task_list_response,
        name: new_task_list_name
    }]));
}

export async function adds_a_task() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await addTask(task_id);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(getTasks(tasks.getSnapshot().context)).toEqual(mapApiTasks(add_task_list_response_with_tasks.tasks));
}

export async function notifies_when_failing_to_add_a_task() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, { error: "Failed to add a task" }, false);
    tasks.send({type: "add", content: "Task content"});
    await waitUntil(wait_for_add_task);
    expect(the_error).toEqual({error: "Failed to add a task", type: "error", code: 422});
}

export async function notifies_when_failing_to_tick_off_a_task() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"})
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"})
    await addTask(task_id);

    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    const wait_for_tick_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/tick`, { error: "Failed to tick a task" }, false);
    tasks.send({ type: "tick", id: task_id });
    await waitUntil(wait_for_tick_task);
    expect(the_error).toEqual({error: "Failed to tick a task", type: "error", code: 422});
}

export async function lets_user_tick_off_task() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"})
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"})
    await addTask(task_id);
    await tickTask(task_id);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(getTasks(tasks.getSnapshot().context)).toEqual([
        {
            ...mapApiTask(add_task_list_response_with_tasks.tasks[0]),
            ticked: true
        }   
    ])
}

export async function selects_a_different_tasks_list() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", another_add_task_list_response)
    tasks.send({type: "addTasksList", id: another_task_list_id, name: another_task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    const wait_for_update_last_selected_time = mockServer.patch(`/tasks-lists/${another_task_list_id}/last-selected-time`)
    tasks.send({type: "selectTasksList", id: another_task_list_id});
    await waitUntil(wait_for_update_last_selected_time)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);

    expect(tasks.getSnapshot().context.id).toEqual(another_task_list_id);
    expect(getName(tasks.getSnapshot().context)).toEqual(another_task_list_name);
    expect(getTasks(tasks.getSnapshot().context)).toEqual([]);
    expect(tasks.getSnapshot().context.tasksLists).toEqual(mapApiTasksLists([
        add_task_list_response,
        another_add_task_list_response
    ]));
}

export async function notifies_when_failing_to_select_a_different_tasks_list() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"})
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", another_add_task_list_response)
    tasks.send({type: "addTasksList", id: another_task_list_id, name: another_task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    const wait_for_update_last_selected_time = mockServer.patch(`/tasks-lists/${another_task_list_id}/last-selected-time`, { error: "Failed to select tasks list" }, false)
    tasks.send({type: "selectTasksList", id: another_task_list_id});
    await waitUntil(wait_for_update_last_selected_time)
    expect(the_error).toEqual({error: "Failed to select tasks list", type: "error", code: 422});
}

export async function shares_a_task_list() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"})
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    const wait_for_share_tasks_list = mockServer.patch(`/tasks-lists/${task_list_id}/share`)
    tasks.send({type: "shareTasksList", id: task_list_id, email: another_email_to_share});
    await waitUntil(wait_for_share_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(tasks.getSnapshot().context.tasksLists).toEqual(mapApiTasksLists([
        {
            ...add_task_list_response,
            shared_with: [email_to_share, another_email_to_share]
        }
    ]));
}

export async function notifies_when_failing_to_share_a_task_list() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"})
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    const wait_for_share_tasks_list = mockServer.patch(`/tasks-lists/${task_list_id}/share`, { error: "Failed to share tasks list" }, false)
    tasks.send({type: "shareTasksList", id: task_list_id});
    await waitUntil(wait_for_share_tasks_list)
    expect(the_error).toEqual({error: "Failed to share tasks list", type: "error", code: 422});
}

export async function unshares_a_task_list() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"})
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    const wait_for_unshare_tasks_list = mockServer.patch(`/tasks-lists/${task_list_id}/unshare`)
    tasks.send({type: "unshareTasksList", id: task_list_id, email: email_to_share});
    await waitUntil(wait_for_unshare_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(tasks.getSnapshot().context.tasksLists).toEqual(mapApiTasksLists([
        {
            ...add_task_list_response,
            shared_with: []
        }
    ]));
}

export async function notifies_when_failing_to_unshare_a_task_list() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"})
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    const wait_for_unshare_tasks_list = mockServer.patch(`/tasks-lists/${task_list_id}/unshare`, { error: "Failed to unshare tasks list" }, false)
    tasks.send({type: "unshareTasksList", id: task_list_id});
    await waitUntil(wait_for_unshare_tasks_list)
    expect(the_error).toEqual({error: "Failed to unshare tasks list", type: "error", code: 422});
}

export async function unshares_a_task_list_for_self() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"})
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", another_add_task_list_response)
    tasks.send({type: "addTasksList", id: another_task_list_id, name: another_task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", add_task_list_response)
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    const wait_for_unshare_tasks_list = mockServer.patch(`/tasks-lists/${task_list_id}/unshare-self`)
    tasks.send({type: "unshareTasksListForSelf", id: task_list_id});
    await waitUntil(wait_for_unshare_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(tasks.getSnapshot().context.id).toEqual(another_task_list_id);
    expect(tasks.getSnapshot().context.tasksLists).toEqual(mapApiTasksLists([another_add_task_list_response]));
}

export async function notifies_when_failing_to_unshare_a_task_list_for_self() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"})
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    const wait_for_unshare_tasks_list = mockServer.patch(`/tasks-lists/${task_list_id}/unshare-self`, { error: "Failed to unshare tasks list for self" }, false)
    tasks.send({type: "unshareTasksListForSelf", id: task_list_id});
    await waitUntil(wait_for_unshare_tasks_list)
    expect(the_error).toEqual({error: "Failed to unshare tasks list for self", type: "error", code: 422});
}

export async function adds_maximum_tasks_and_then_refuses_subsequent_tasks() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks();
    expect(getTasks(tasks.getSnapshot().context).length).toEqual(reducedTaskLimit);
    expect(tasks.getSnapshot().value).toStrictEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export async function lets_user_carry_tasks() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks();
    await carry_all_tasks();
    expect(getTasks(tasks.getSnapshot().context).filter((n) => n.page === 1).length).toEqual(reducedTaskLimit);
    expect(getTasks(tasks.getSnapshot().context).filter((n) => !n.carried).length).toEqual(reducedTaskLimit);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export async function notifies_when_failing_to_carry_a_task() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"})
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"})
    await add_all_tasks();

    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    const wait_for_carry_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/carry`, { error: "Failed to carry a task" }, false)
    tasks.send({type: "carry", id: task_id});
    await waitUntil(wait_for_carry_task)
    expect(the_error).toEqual({error: "Failed to carry a task", type: "error", code: 422});
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export async function removes_ticked_tasks_when_all_tasks_are_carried() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks_except_one();
    
    await tickTask(task_ids[0]);
    await tickTask(task_ids[1]);
    
    await add_last_task();
    await carry_all_tasks();

    expect(getTasks(tasks.getSnapshot().context).length).toEqual(reducedTaskLimit - 2);
    expect(getTasks(tasks.getSnapshot().context).filter((n) => n.page === 1).length).toEqual(reducedTaskLimit - 2);
    expect(getTasks(tasks.getSnapshot().context).filter((n) => !n.carried).length).toEqual(reducedTaskLimit - 2);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
}

export async function lets_user_remove_tasks() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks();
    await remove_all_tasks();
    expect(getTasks(tasks.getSnapshot().context).length).toEqual(0);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
}

export async function notifies_when_failing_to_remove_a_task() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks();
    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    const wait_for_remove_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/remove`, { error: "Failed to remove a task" }, false)
    tasks.send({type: "remove", id: task_id});
    await waitUntil(wait_for_remove_task)
    expect(the_error).toEqual({error: "Failed to remove a task", type: "error", code: 422});
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export async function lets_user_tick_off_task_during_carry() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"})
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"})
    await add_all_tasks();
    await carry_all_tasks_except_one();
    await tick_last_task();
    expect(getTasks(tasks.getSnapshot().context).filter((n) => n.page === 1).length).toEqual(reducedTaskLimit - 1);
    expect(getTasks(tasks.getSnapshot().context).filter((n) => !n.carried).length).toEqual(reducedTaskLimit - 1);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
}

export async function notifies_when_failing_to_tick_off_a_task_during_carry() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"})
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"})
    await add_all_tasks();
    await carry_all_tasks_except_one();
    let the_error = {};
    tasks.on("error", (e) => the_error = e);
    const wait_for_tick_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_ids[0]}/tick`, { error: "Failed to tick a task" }, false)
    tasks.send({type: "tick", id: task_ids[0]});
    await waitUntil(wait_for_tick_task)
    expect(the_error).toEqual({error: "Failed to tick a task", type: "error", code: 422});
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export async function cannot_carry_tasks_past_two_pages() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks();
    await carry_all_tasks_except_one();
    await remove_task(task_ids[task_ids.length - 1]);
    await addTask(task_ids[task_ids.length - 1]);
    await carry_all_tasks();
    expect(getTasks(tasks.getSnapshot().context).filter((n) => n.page === 1).length).toEqual(1);
    await carry_all_tasks();
    expect(getTasks(tasks.getSnapshot().context).filter((n) => n.page === 2).length).toEqual(reducedTaskLimit);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export async function selecting_a_different_tasks_list_retrieves_correct_tasks() {
    await waitForLoadingToFinish();
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks();

    wait_for_create_tasks_list = mockServer.post("/tasks-lists", another_add_task_list_response)
    tasks.send({type: "addTasksList", id: another_task_list_id, name: another_task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    let wait_for_update_last_selected_time = mockServer.patch(`/tasks-lists/${another_task_list_id}/last-selected-time`)
    tasks.send({type: "selectTasksList", id: another_task_list_id});
    await waitUntil(wait_for_update_last_selected_time)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks_for_another_task_list();

    wait_for_update_last_selected_time = mockServer.patch(`/tasks-lists/${task_list_id}/last-selected-time`)
    tasks.send({type: "selectTasksList", id: task_list_id});
    await waitUntil(wait_for_update_last_selected_time)
    expect(getTasks(tasks.getSnapshot().context).length).toEqual(reducedTaskLimit);
    expect(getTasks(tasks.getSnapshot().context)[0].id).toEqual(task_ids[0]);

    wait_for_update_last_selected_time = mockServer.patch(`/tasks-lists/${another_task_list_id}/last-selected-time`)
    tasks.send({type: "selectTasksList", id: another_task_list_id});
    await waitUntil(wait_for_update_last_selected_time)
    expect(getTasks(tasks.getSnapshot().context).length).toEqual(reducedTaskLimit);
    expect(getTasks(tasks.getSnapshot().context)[0].id).toEqual(another_set_of_task_ids[0]);
}

async function waitForLoadingToFinish() {
    await waitUntil(() => tasks.getSnapshot().value !== TasksListMachineStates.loading);
}


async function tickTask(task_id: string) {
    const wait_for_tick_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/tick`);
    tasks.send({ type: "tick", id: task_id });
    await waitUntil(wait_for_tick_task);
}

async function tick_last_task() {
    await tickTask(task_ids[task_ids.length - 1]);
}

async function addTask(task_id: string) {
    const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, {id: task_id});
    tasks.send({type: "add", content: "Task content"});
    await waitUntil(wait_for_add_task);
}

async function add_all_tasks() {
    for (const task_id of task_ids) {
        await addTask(task_id);
    }
}

async function add_all_tasks_for_another_task_list() {
    for (const task_id of another_set_of_task_ids) {
        const wait_for_add_task = mockServer.post(`/tasks-lists/${another_task_list_id}/task`, {id: task_id})
        tasks.send({type: "add", content: "2nd Task content"});
        await waitUntil(wait_for_add_task)
    }
}

async function remove_all_tasks() {
    for (const task_id of task_ids) {
        await remove_task(task_id);
    }
}

async function remove_task(task_id: string) {
    const wait_for_remove_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/remove`)
    tasks.send({type: "remove", id: task_id});
    await waitUntil(wait_for_remove_task)
}

async function add_all_tasks_except_one() {
    for (const task_id of task_ids.slice(0, -1)) {
        await addTask(task_id);
    }
}

async function add_last_task() {
    await addTask(task_ids[task_ids.length - 1]);
}

async function carry_all_tasks() {
    for (const task_id of task_ids) {
        const wait_for_carry_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/carry`)
        tasks.send({type: "carry", id: task_id});
        await waitUntil(wait_for_carry_task)
    }
}

async function carry_all_tasks_except_one() {
    for (const task_id of task_ids.slice(0, -1)) {
        const wait_for_carry_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/carry`)
        tasks.send({type: "carry", id: task_id});
        await waitUntil(wait_for_carry_task)
    }
}
