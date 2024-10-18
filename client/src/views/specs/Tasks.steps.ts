import {afterAll, afterEach, beforeEach, expect} from 'vitest'
import {
    addAnotherTaskList,
    addATaskList,
    addFirstTaskHidden,
    addTask, addTaskDisabled,
    addTaskListSubmitDisabled,
    addTaskVisible,
    another_task_list_id,
    another_task_list_name,
    carryTask,
    carryTaskHidden,
    characterCount,
    characterCountHidden,
    clickAddFirstTask,
    clickAddTaskListPlaceholder,
    createActor,
    pageText,
    removeTask,
    removeTaskHidden,
    renderTasksView,
    stopActor,
    task_list_id,
    task_list_name,
    taskCount,
    taskCountHidden,
    taskListCharacterCount,
    taskListCharacterCountHidden,
    taskListNameInputText,
    taskListSingleSelectChosenValue,
    taskListSingleSelectHidden,
    taskListSingleSelectIndex,
    taskPageNumber,
    tasksListInputCaretPointsDown,
    tasksListInputCaretPointsUp,
    tasksListInputCollapsed,
    tasksListSingleSelectCaretPointsDown,
    tasksListSingleSelectCollapsed,
    taskTextShown, the_status,
    tickTask,
    tickTaskHidden,
    toggleTasksListInput,
    toggleTasksListSingleSelect,
    typeTask,
    typeTaskListName,
    unmountTasksView
} from './Tasks.page'
import {MockServer} from "@/testing/mock-server";
import {reducedTaskLimit, waitUntil} from "@/testing/utilities";

const testTaskText = "Hello, world!";
const testTaskTextMoreThan150Chars =
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis_pa";
const mockServer = MockServer.New();
const task_ids = Array.from({length: reducedTaskLimit}, (_) => crypto.randomUUID());
let wait_for_create_tasks_list: () => boolean;


beforeEach(() => {
    mockServer.reset();
    mockServer.get("/tasks-lists", [])
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {id: task_list_id, name: task_list_name})
    mockServer.start()
    createActor();
});

afterEach(() => {
    unmountTasksView();
});

afterAll(() => {
    stopActor();
});

export async function renders_tasks() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    expect(pageText()).toContain("Add your first task");
}

export async function asks_user_to_create_first_task_list() {
    renderTasksView();
    expect(pageText()).toContain("Create your first task list");
    expect(pageText()).not.toContain("Add your first task");
}

export async function shows_task_list_single_select_when_there_are_two_lists() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {
        id: another_task_list_id,
        name: another_task_list_name
    })
    await waitUntil(() => !addTaskListSubmitDisabled());
    await addAnotherTaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    expect(taskListSingleSelectHidden()).toBe(false);
    expect(pageText()).not.toContain("Create your first task list");
    expect(taskListSingleSelectChosenValue()).toBe(task_list_id);
    expect(taskListNameInputText()).toBe("");
}

export async function lets_user_collapse_tasks_list_single_select() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {
        id: another_task_list_id,
        name: another_task_list_name
    })
    await waitUntil(() => !addTaskListSubmitDisabled());
    await addAnotherTaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    expect(tasksListSingleSelectCollapsed()).toBe(true);
    expect(tasksListSingleSelectCaretPointsDown()).toBe(true);
}

export async function lets_user_expand_tasks_list_single_select() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {
        id: another_task_list_id,
        name: another_task_list_name
    })
    await waitUntil(() => !addTaskListSubmitDisabled());
    await addAnotherTaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    await toggleTasksListSingleSelect();
    expect(tasksListSingleSelectCollapsed()).toBe(false);
    expect(tasksListSingleSelectCaretPointsDown()).toBe(false);
}

export async function selects_first_of_multiple_lists() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {
        id: another_task_list_id,
        name: another_task_list_name
    })
    await waitUntil(() => !addTaskListSubmitDisabled());
    await addAnotherTaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    expect(taskListSingleSelectIndex()).toBe(0);
}

export async function lets_user_add_a_task_list() {
    renderTasksView();
    await addATaskList();
}

export async function displays_list_character_count_limit() {
    renderTasksView();
    await clickAddTaskListPlaceholder();
    await typeTaskListName(testTaskTextMoreThan150Chars);
    expect(taskListCharacterCount()).toBe("50/50");
}

export async function list_character_count_limit_hidden_when_input_is_empty() {
    renderTasksView();
    await clickAddTaskListPlaceholder();
    expect(taskListCharacterCountHidden()).toBe(true);
}

export async function lets_user_collapse_tasks_list_input() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await toggleTasksListInput();
    expect(tasksListInputCollapsed()).toBe(true);
    expect(tasksListInputCaretPointsDown()).toBe(true);
}

export async function lets_user_expand_tasks_list_input() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await toggleTasksListInput();
    await toggleTasksListInput();
    expect(tasksListInputCollapsed()).toBe(false);
    expect(tasksListInputCaretPointsUp()).toBe(true);
}

export async function removes_add_first_task_placeholder_on_click() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    expect(addFirstTaskHidden()).toBe(true);
    expect(addTaskVisible()).toBe(true);
}

export async function shows_task_count_if_there_are_tasks() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    expect(taskCountHidden()).toBe(true);
    let wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, { id: task_ids[0] })
    await typeTask(testTaskText);
    await addTask();
    await waitUntil(wait_for_add_task)
    await waitUntil(() => !addTaskDisabled());
    expect(taskCount()).toBe(`1/${reducedTaskLimit} tasks`);
}

export async function disables_add_task_button_when_input_is_empty() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    await addTask();
    expect(addTaskVisible()).toBe(true);
}

export async function adds_and_lists_a_task() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    let wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, { id: task_ids[0] })
    await typeTask(testTaskText);
    await addTask();
    await waitUntil(wait_for_add_task)
    await waitUntil(() => !addTaskDisabled());
    expect(taskTextShown(task_ids[0], testTaskText)).toBe(true);
}

export async function limits_task_length_to_150_characters() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    let wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, { id: task_ids[0] })
    await typeTask(testTaskTextMoreThan150Chars);
    await addTask();
    await waitUntil(wait_for_add_task)
    await waitUntil(() => !addTaskDisabled());
    expect(taskTextShown(task_ids[0], testTaskTextMoreThan150Chars.slice(0, 150))).toBe(true);
}

export async function displays_character_count_limit() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    await typeTask(testTaskTextMoreThan150Chars);
    expect(characterCount()).toBe("150/150");
}

export async function character_count_limit_hidden_when_input_is_empty() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    expect(characterCountHidden()).toBe(true);
}

export async function lets_user_tick_tasks() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    await typeTask(testTaskText);

    await add_all_tasks_except_one();
    for (const task_id of task_ids) {
        if (task_id !== task_ids[task_ids.length - 1]) {
            await tickTask(task_id);
            expect(tickTaskHidden(task_id)).toBe(true);
        }
    }
}

export async function lets_user_carry_tasks() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    await typeTask(testTaskText);
    await add_all_tasks();
    await waitUntil( () => !carryTaskHidden(task_ids[0]));
    for (const task_id of task_ids) {
        await carryTask(task_id);
        if (task_id !== task_ids[task_ids.length - 1]) {
            expect(carryTaskHidden(task_id)).toBe(true);
        }
    }
}

export async function lets_user_remove_tasks() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    await typeTask(testTaskText);
    await add_all_tasks();
    await waitUntil( () => !removeTaskHidden(task_ids[0]));
    for (const task_id of task_ids) {
        await removeTask(task_id);
        expect(removeTaskHidden(task_id)).toBe(true);
    }
}

export async function displays_page_number_of_tasks() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    await typeTask(testTaskText);
    await add_all_tasks();
    await waitUntil( () => !carryTaskHidden(task_ids[0]));
    for (const task_id of task_ids) {
        expect(taskPageNumber(task_id)).toBe('0');
        await carryTask(task_id);
        expect(taskPageNumber(task_id)).toBe('1');
    }
}

export async function only_shows_remove_tasks_for_tasks_carried_twice() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    await typeTask(testTaskText);
    await add_all_tasks();
    await waitUntil( () => !carryTaskHidden(task_ids[0]));
    for (const task_id of task_ids) {
        await carryTask(task_id);
        if (task_id !== task_ids[task_ids.length - 1]) {
            expect(carryTaskHidden(task_id)).toBe(true);
        }
    }
    for (const task_id of task_ids) {
        await carryTask(task_id);
        if (task_id !== task_ids[task_ids.length - 1]) {
            expect(carryTaskHidden(task_id)).toBe(true);
        }
    }
    for (const task_id of task_ids) {
        expect(carryTaskHidden(task_id)).toBe(true);
        expect(removeTaskHidden(task_id)).toBe(false);
    }
}

export async function does_not_show_remove_or_carry_for_ticked_tasks() {
    renderTasksView();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await clickAddFirstTask();
    await typeTask(testTaskText);
    await add_all_tasks_except_one();
    for (const task_id of task_ids) {
        if (task_id !== task_ids[task_ids.length - 1]) {
            await tickTask(task_id);
        }
    }
    for (const task_id of task_ids) {
        if (task_id !== task_ids[task_ids.length - 1]) {
            expect(carryTaskHidden(task_id)).toBe(true);
            expect(removeTaskHidden(task_id)).toBe(true);
        }
    }
}

async function add_all_tasks_except_one() {
    for (const task_id of task_ids) {
        let wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, {id: task_id})
        if (task_id !== task_ids[task_ids.length - 1]) {
            await addTask();
            await waitUntil(wait_for_add_task)
            await waitUntil(() => !addTaskDisabled());
        }
    }
}

async function add_all_tasks() {
    for (const task_id of task_ids) {
        let wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, {id: task_id})
        await addTask();
        await waitUntil(wait_for_add_task)
        if (task_id !== task_ids[task_ids.length - 1]) {
            await waitUntil(() => !addTaskDisabled());
        }
    }
}
