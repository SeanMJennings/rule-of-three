import {tasksMachine} from "@/state-machines/tasks.state-machine";
import {afterEach, beforeEach, expect} from 'vitest'
import {type Actor, createActor} from 'xstate'
import {TasksMachineCombinedStates} from "@/state-machines/tasks.states";
import {MockServer} from "@/testing/mock-server";
import {reducedTaskLimit, waitUntil} from "@/testing/utilities";
import {getName, getTasks} from "@/state-machines/tasks.extensions";

const mockServer = MockServer.New();
let tasks = {} as Actor<typeof tasksMachine>;
const task_list_id = crypto.randomUUID();
const another_task_list_id = crypto.randomUUID();
const task_id = crypto.randomUUID();
const task_list_name = "Task list name";
const new_task_list_name = "New task list name";
const another_task_list_name = "2nd task list name";
const task_ids = Array.from({length: reducedTaskLimit}, () => crypto.randomUUID());
const another_set_of_task_ids = Array.from({length: reducedTaskLimit}, () => crypto.randomUUID());
let wait_for_get_tasks_list: () => boolean;
let wait_for_create_tasks_list: () => boolean;

beforeEach(() => {
    mockServer.reset();
    wait_for_get_tasks_list = mockServer.get("/tasks-lists", [])
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {id: task_list_id })
    mockServer.start();
    tasks = createActor(tasksMachine);
    tasks.start();
});

afterEach(() => {
    tasks.send({type: "reset"})
});

export async function adds_a_task_list() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsEmpty);
    expect(tasks.getSnapshot().context.id).toEqual(task_list_id);
    expect(getName(tasks.getSnapshot().context)).toEqual(task_list_name);
    expect(getTasks(tasks.getSnapshot().context)).toEqual([]);
}

export async function loads_a_task_list() {
    wait_for_get_tasks_list = mockServer.get("/tasks-lists", [{id: task_list_id, name: task_list_name, tasks: [{
        id: task_id,
        content: "Task content",
        carried: false,
        page: 0,
        ticked: false
        }]}])
    tasks.send({type: "reset"})
    await waitUntil(wait_for_get_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(tasks.getSnapshot().context.id).toEqual(task_list_id);
    expect(getName(tasks.getSnapshot().context)).toEqual(task_list_name);
    expect(getTasks(tasks.getSnapshot().context)).toEqual([{
        id: task_id,
        content: "Task content",
        carried: false,
        page: 0,
        ticked: false
    }]);
}

export async function adds_two_task_lists() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {
        id: another_task_list_id,
        name: another_task_list_name
    })
    tasks.send({type: "addTasksList", name: another_task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsEmpty);
    expect(tasks.getSnapshot().context.tasksLists).toEqual([{
        id: task_list_id,
        name: task_list_name,
        tasks: []
    }, {id: another_task_list_id, name: another_task_list_name, tasks: []}]);
}

export async function updates_a_task_list_name() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    const wait_for_update_tasks_list = mockServer.patch(`/tasks-lists/${task_list_id}`)
    tasks.send({type: "updateTasksList", id: task_list_id, name: new_task_list_name});
    await waitUntil(wait_for_update_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsEmpty);
    expect(tasks.getSnapshot().context.id).toEqual(task_list_id);
    expect(getName(tasks.getSnapshot().context)).toEqual(new_task_list_name);
    expect(getTasks(tasks.getSnapshot().context)).toEqual([]);
    expect(tasks.getSnapshot().context.tasksLists).toEqual([{id: task_list_id, name: new_task_list_name, tasks: []}]);
}

export async function adds_a_task() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, { id: task_id })
    tasks.send({type: "add", content: "Task content"});
    await waitUntil(wait_for_add_task)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(getTasks(tasks.getSnapshot().context)).toEqual([{
        id: task_id,
        content: "Task content",
        carried: false,
        removed: false,
        page: 0,
        ticked: false
    }]);
}

export async function lets_user_tick_off_task() {
    tasks.send({type: "readyToAddFirstTaskList"})
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"})
    const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, { id: task_id })
    tasks.send({type: "add", content: "Task content"})
    await waitUntil(wait_for_add_task)
    const wait_for_tick_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/tick`)
    tasks.send({type: "tick", id: task_id})
    await waitUntil(wait_for_tick_task)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(getTasks(tasks.getSnapshot().context)).toEqual([{
        id: task_id,
        content: "Task content",
        carried: false,
        removed: false,
        page: 0,
        ticked: true
    }])
}

export async function selects_a_different_tasks_list() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {
        id: another_task_list_id,
        name: another_task_list_name
    })
    
    tasks.send({type: "addTasksList", id: another_task_list_id, name: another_task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    
    tasks.send({type: "selectTasksList", id: another_task_list_id});
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsEmpty);

    expect(tasks.getSnapshot().context.id).toEqual(another_task_list_id);
    expect(getName(tasks.getSnapshot().context)).toEqual(another_task_list_name);
    expect(getTasks(tasks.getSnapshot().context)).toEqual([]);
    expect(tasks.getSnapshot().context.tasksLists).toEqual([
        {id: task_list_id, name: task_list_name, tasks: []},
        {id: another_task_list_id, name: another_task_list_name, tasks: []},
    ]);
}

export async function adds_maximum_tasks_and_then_refuses_subsequent_tasks() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks();
    expect(getTasks(tasks.getSnapshot().context).length).toEqual(reducedTaskLimit);
    expect(tasks.getSnapshot().value).toStrictEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export async function lets_user_carry_tasks() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks();
    carry_all_tasks();
    expect(getTasks(tasks.getSnapshot().context).filter((n) => n.page === 1).length).toEqual(reducedTaskLimit);
    expect(getTasks(tasks.getSnapshot().context).filter((n) => !n.carried).length).toEqual(reducedTaskLimit);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export async function removes_ticked_tasks_when_all_tasks_are_carried() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks_except_one();
    let wait_for_tick_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_ids[0]}/tick`)
    tasks.send({type: "tick", id: task_ids[0]});
    await waitUntil(wait_for_tick_task)
    wait_for_tick_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_ids[1]}/tick`)
    tasks.send({type: "tick", id: task_ids[1]});
    await waitUntil(wait_for_tick_task)
    await add_last_task();

    carry_all_tasks();

    expect(getTasks(tasks.getSnapshot().context).length).toEqual(reducedTaskLimit - 2);
    expect(getTasks(tasks.getSnapshot().context).filter((n) => n.page === 1).length).toEqual(reducedTaskLimit - 2);
    expect(getTasks(tasks.getSnapshot().context).filter((n) => !n.carried).length).toEqual(reducedTaskLimit - 2);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
}

export async function lets_user_remove_tasks() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks();
    await remove_all_tasks();
    expect(getTasks(tasks.getSnapshot().context).length).toEqual(0);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
}

export async function lets_user_carry_tasks_maximum_twice() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks();
    carry_all_tasks();
    carry_all_tasks();
    expect(getTasks(tasks.getSnapshot().context).filter((n) => n.page === 2).length).toEqual(reducedTaskLimit);
    expect(getTasks(tasks.getSnapshot().context).filter((n) => !n.carried).length).toEqual(reducedTaskLimit);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export async function selecting_a_different_tasks_list_retrieves_correct_tasks() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks();

    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {
        id: another_task_list_id,
        name: another_task_list_name
    })
    tasks.send({type: "addTasksList", id: another_task_list_id, name: another_task_list_name});
    await waitUntil(wait_for_create_tasks_list)

    tasks.send({type: "selectTasksList", id: another_task_list_id});
    tasks.send({type: "readyToAddFirstTask"});
    await add_all_tasks_for_another_task_list();

    tasks.send({type: "selectTasksList", id: task_list_id});
    expect(getTasks(tasks.getSnapshot().context).length).toEqual(reducedTaskLimit);
    expect(getTasks(tasks.getSnapshot().context)[0].id).toEqual(task_ids[0]);

    tasks.send({type: "selectTasksList", id: another_task_list_id});
    expect(getTasks(tasks.getSnapshot().context).length).toEqual(reducedTaskLimit);
    expect(getTasks(tasks.getSnapshot().context)[0].id).toEqual(another_set_of_task_ids[0]);
}

async function add_all_tasks() {
    for (const task_id of task_ids) {
        const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, {id: task_id})
        tasks.send({type: "add", content: "Task content"});
        await waitUntil(wait_for_add_task)
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
        const wait_for_remove_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/remove`)
        tasks.send({type: "remove", id: task_id});
        await waitUntil(wait_for_remove_task)
    }
}

async function add_all_tasks_except_one() {
    for (const task_id of task_ids.slice(0, -1)) {
        const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, {id: task_id})
        tasks.send({type: "add", content: "Task content"});
        await waitUntil(wait_for_add_task)
    }
}

async function add_last_task() {
    const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, {id: task_ids[reducedTaskLimit - 1]})
    tasks.send({type: "add", content: "Task content"});
    await waitUntil(wait_for_add_task)
}

function carry_all_tasks() {
    for (const task_id of task_ids) {
        tasks.send({type: "carry", id: task_id});
    }
}
