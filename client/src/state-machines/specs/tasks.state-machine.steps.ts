import {tasksMachine} from "@/state-machines/tasks.state-machine";
import {afterAll, afterEach, beforeEach, expect} from 'vitest'
import {type Actor, createActor} from 'xstate'
import {TasksMachineCombinedStates} from "@/state-machines/tasks.states";
import {MockServer} from "@/testing/mock-server";
import {waitUntil} from "@/testing/utilities";

const mockServer = MockServer.New();
let tasks = {} as Actor<typeof tasksMachine>;
const task_list_id = crypto.randomUUID();
const another_task_list_id = crypto.randomUUID();
const task_id = crypto.randomUUID();
const task_list_name = "Task list name";
const new_task_list_name = "New task list name";
const another_task_list_name = "2nd task list name";
let wait_for_get_tasks_list: () => boolean;
let wait_for_create_tasks_list: () => boolean;

beforeEach(() => {
    mockServer.reset();
    wait_for_get_tasks_list = mockServer.get("/tasks-list", [])
    wait_for_create_tasks_list = mockServer.post("/tasks-list", {id: task_list_id, name: task_list_name})
    mockServer.start()
    tasks = createActor(tasksMachine);
    tasks.start();
});

afterEach(() => {
    tasks.send({type: "reset"})
});

afterAll(() => {
    tasks.stop();
});

export async function adds_a_task_list() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsEmpty);
    expect(tasks.getSnapshot().context.id).toEqual(task_list_id);
    expect(tasks.getSnapshot().context.name).toEqual(task_list_name);
    expect(tasks.getSnapshot().context.tasks).toEqual([]);
    expect(tasks.getSnapshot().context.tasksLists).toEqual([{id: task_list_id, name: task_list_name, tasks: []}]);
}

export async function loads_a_task_list() {
    wait_for_get_tasks_list = mockServer.get("/tasks-list", [{id: task_list_id, name: task_list_name, tasks: []}])
    tasks.send({type: "reset"})
    await waitUntil(wait_for_get_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsEmpty);
    expect(tasks.getSnapshot().context.id).toEqual(task_list_id);
    expect(tasks.getSnapshot().context.name).toEqual(task_list_name);
    expect(tasks.getSnapshot().context.tasks).toEqual([]);
    expect(tasks.getSnapshot().context.tasksLists).toEqual([{
        id: task_list_id,
        name: task_list_name,
        tasks: []
    }]);
}

export async function adds_two_task_lists() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-list", {
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
    let wait_for_update_tasks_list = mockServer.patch(`/tasks-list/${task_list_id}`)
    tasks.send({type: "updateTasksList", id: task_list_id, name: new_task_list_name});
    await waitUntil(wait_for_update_tasks_list)
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsEmpty);
    expect(tasks.getSnapshot().context.id).toEqual(task_list_id);
    expect(tasks.getSnapshot().context.name).toEqual(new_task_list_name);
    expect(tasks.getSnapshot().context.tasks).toEqual([]);
    expect(tasks.getSnapshot().context.tasksLists).toEqual([{id: task_list_id, name: new_task_list_name, tasks: []}]);
}

export async function adds_a_task() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    tasks.send({type: "add", content: "Task content"});
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(tasks.getSnapshot().context.tasks).toEqual([{
        id: 1,
        content: "Task content",
        carried: false,
        page: 0,
        ticked: false
    }]);
}

export async function lets_user_tick_off_task() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    tasks.send({type: "add", content: "Task content"});
    tasks.send({type: "tick", id: 1});
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
    expect(tasks.getSnapshot().context.tasks).toEqual([{
        id: 1,
        content: "Task content",
        carried: false,
        page: 0,
        ticked: true
    }]);
}

export async function selects_a_different_tasks_list() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-list", {
        id: another_task_list_id,
        name: another_task_list_name
    })
    tasks.send({type: "readyToAddFirstTask"});
    tasks.send({type: "add", content: "Task content"});
    tasks.send({type: "addTasksList", id: another_task_list_id, name: another_task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "selectTasksList", id: another_task_list_id});
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsEmpty);

    expect(tasks.getSnapshot().context.id).toEqual(another_task_list_id);
    expect(tasks.getSnapshot().context.name).toEqual(another_task_list_name);
    expect(tasks.getSnapshot().context.tasks).toEqual([]);
    expect(tasks.getSnapshot().context.tasksLists).toEqual([
        {id: task_list_id, name: task_list_name, tasks: []},
        {id: another_task_list_id, name: another_task_list_name, tasks: []},
    ]);
}

export async function adds_22_tasks_and_then_refuses_subsequent_tasks() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    for (let i = 0; i < 22; i++) {
        tasks.send({type: "add", content: "Task content", page: 0});
    }
    expect(tasks.getSnapshot().context.tasks.length).toEqual(22);
    expect(tasks.getSnapshot().value).toStrictEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export async function lets_user_carry_tasks() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    for (let i = 0; i < 22; i++) {
        tasks.send({type: "add", content: "Task content"});
    }
    for (let i = 0; i < 22; i++) {
        tasks.send({type: "carry", id: i + 1});
    }
    expect(tasks.getSnapshot().context.tasks.filter((n) => n.page === 1).length).toEqual(22);
    expect(tasks.getSnapshot().context.tasks.filter((n) => n.carried === false).length).toEqual(22);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export async function removes_ticked_tasks_when_all_tasks_are_carried() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    for (let i = 0; i < 20; i++) {
        tasks.send({type: "add", content: "Task content"});
    }
    tasks.send({type: "tick", id: 19});
    tasks.send({type: "tick", id: 20});
    tasks.send({type: "add", content: "Task content"});
    tasks.send({type: "add", content: "Task content"});

    for (let i = 0; i < 22; i++) {
        tasks.send({type: "carry", id: i + 1});
    }

    expect(tasks.getSnapshot().context.tasks.length).toEqual(20);
    expect(tasks.getSnapshot().context.tasks.filter((n) => n.page === 1).length).toEqual(20);
    expect(tasks.getSnapshot().context.tasks.filter((n) => n.carried === false).length).toEqual(20);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
}

export async function lets_user_remove_tasks() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    for (let i = 0; i < 22; i++) {
        tasks.send({type: "add", content: "Task content"});
    }
    for (let i = 0; i < 22; i++) {
        tasks.send({type: "remove", id: i + 1});
    }
    expect(tasks.getSnapshot().context.tasks.length).toEqual(0);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
}

export async function lets_user_carry_tasks_maximum_twice() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    for (let i = 0; i < 22; i++) {
        tasks.send({type: "add", content: "Task content"});
    }
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 22; i++) {
            tasks.send({type: "carry", id: i + 1});
        }
    }
    expect(tasks.getSnapshot().context.tasks.filter((n) => n.page === 2).length).toEqual(22);
    expect(tasks.getSnapshot().context.tasks.filter((n) => n.carried === false).length).toEqual(22);
    expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export async function selecting_a_tasks_list_resets_the_tasks() {
    tasks.send({type: "readyToAddFirstTaskList"});
    tasks.send({type: "addTasksList", id: task_list_id, name: task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "addTasksList", id: another_task_list_id, name: another_task_list_name});
    await waitUntil(wait_for_create_tasks_list)
    tasks.send({type: "readyToAddFirstTask"});
    for (let i = 0; i < 22; i++) {
        tasks.send({type: "add", content: "Task content"});
    }
    tasks.send({type: "selectTasksList", id: another_task_list_id});

    expect(tasks.getSnapshot().context.tasks.length).toEqual(0);
}
