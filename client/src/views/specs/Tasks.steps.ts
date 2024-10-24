import {afterAll, afterEach, beforeEach, expect} from 'vitest'
import {
    addAnotherTaskList,
    addATaskList,
    addTask, addTaskDisabled,
    addTaskListSubmitDisabled,
    addTaskVisible,
    another_task_list_id,
    another_task_list_name,
    carryTask,
    carryTaskHidden,
    characterCount,
    characterCountHidden,
    clickAddTaskListPlaceholder, closeErrorOverlay,
    createActor, deleteTaskList, errorOverlayExists, errorOverlayText, loadingSpinnerExists,
    pageText,
    removeTask,
    removeTaskHidden,
    renderTasksView, resetActor, selectOptionFromTaskListSingleSelect,
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
    taskPageNumber, tasksListCaretExists,
    tasksListInputCaretPointsDown,
    tasksListInputCaretPointsUp,
    tasksListInputCollapsed,
    tasksListSingleSelectCaretPointsDown,
    tasksListSingleSelectCollapsed,
    taskTextShown,
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
const anotherTestTaskText = "Goodbye, world!";
const testTaskTextMoreThan150Chars =
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis_pa";
const mockServer = MockServer.New();
const task_ids = Array.from({length: reducedTaskLimit}, () => crypto.randomUUID());
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
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    expect(pageText().endsWith("Add a Task")).toBe(true);
}

export async function displays_loading_spinner_until_task_lists_are_loaded() {
    mockServer.get("/tasks-lists", [], 1000)
    renderTasksView();
    resetActor();
    expect(loadingSpinnerExists()).toBe(true);
}

export async function asks_user_to_create_first_task_list() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    expect(pageText()).toContain("Create your first task list");
    expect(pageText()).not.toContain("Add your first task");
}

export async function shows_task_list_single_select_when_there_is_one_list() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {
        id: task_list_id,
        name: task_list_name
    })
    await waitUntil(() => !addTaskListSubmitDisabled());
    expect(taskListSingleSelectHidden()).toBe(false);
    expect(pageText()).not.toContain("Create your first task list");
    expect(taskListSingleSelectChosenValue()).toBe(task_list_id);
    expect(taskListNameInputText()).toBe("");
}

export async function lets_user_delete_a_task_list() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {
        id: task_list_id,
        name: task_list_name
    })
    await waitUntil(() => !addTaskListSubmitDisabled());
    const wait_for_delete_tasks_list = mockServer.delete(`/tasks-lists/${task_list_id}`)
    await deleteTaskList()
    await waitUntil(wait_for_delete_tasks_list);
    await waitUntil(() => taskListSingleSelectHidden());
    expect(pageText()).toContain("Create your first task list");
}

export async function lets_user_collapse_tasks_list_single_select() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
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
    await waitForLoadingSpinnerToDisappear();
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
    const wait_for_get_task_lists = mockServer.get("/tasks-lists", [
        {id: task_list_id, name: task_list_name, tasks: []},
        {id: another_task_list_id, name: another_task_list_name, tasks: []}
    ])
    renderTasksView();
    resetActor();
    await waitForLoadingSpinnerToDisappear();
    await waitUntil(wait_for_get_task_lists)
    expect(taskListSingleSelectChosenValue()).toBe(task_list_id);
}

export async function displays_overlay_modal_for_validation_errors() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", { error: "Name is required" }, false);
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(errorOverlayExists);
    expect(errorOverlayText()).toContain("Name is required");
}

export async function lets_user_close_overlay_modal_for_validation_errors() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", { error: "Name is required" }, false);
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(errorOverlayExists);
    await closeErrorOverlay();
    expect(errorOverlayExists()).toBe(false);
}

export async function lets_user_add_a_task_list() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
}

export async function displays_list_character_count_limit() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await clickAddTaskListPlaceholder();
    await typeTaskListName(testTaskTextMoreThan150Chars);
    expect(taskListCharacterCount()).toBe("50/50");
}

export async function list_character_count_limit_hidden_when_input_is_empty() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await clickAddTaskListPlaceholder();
    expect(taskListCharacterCountHidden()).toBe(true);
}

export async function lets_user_collapse_tasks_list_input() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await toggleTasksListInput();
    expect(tasksListInputCollapsed()).toBe(true);
    expect(tasksListInputCaretPointsDown()).toBe(true);
}

export async function ensures_add_tasks_list_is_closed_if_a_task_list_is_loaded() {
    const wait_for_get_task_lists = mockServer.get("/tasks-lists", [
        {id: task_list_id, name: task_list_name, tasks: []}
    ])
    renderTasksView();
    resetActor();
    await waitForLoadingSpinnerToDisappear();
    await waitUntil(wait_for_get_task_lists);
    await waitUntil(() => tasksListCaretExists());
    expect(tasksListInputCollapsed()).toBe(true);
    expect(tasksListInputCaretPointsDown()).toBe(true);
}

export async function lets_user_expand_tasks_list_input() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await toggleTasksListInput();
    await toggleTasksListInput();
    expect(tasksListInputCollapsed()).toBe(false);
    expect(tasksListInputCaretPointsUp()).toBe(true);
}

export async function shows_task_count_if_there_are_tasks() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    expect(taskCountHidden()).toBe(true);
    const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, { id: task_ids[0] })
    await typeTask(testTaskText);
    await addTask();
    await waitUntil(wait_for_add_task)
    await waitUntil(() => !addTaskDisabled());
    expect(taskCount()).toBe(`1/${reducedTaskLimit} tasks`);
}

export async function disables_add_task_button_when_input_is_empty() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await addTask();
    expect(addTaskVisible()).toBe(true);
}

export async function adds_and_lists_a_task() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, { id: task_ids[0] })
    await typeTask(testTaskText);
    await addTask();
    await waitUntil(wait_for_add_task)
    await waitUntil(() => !addTaskDisabled());
    expect(taskTextShown(task_ids[0], testTaskText)).toBe(true);
}

export async function limits_task_length_to_150_characters() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, { id: task_ids[0] })
    await typeTask(testTaskTextMoreThan150Chars);
    await addTask();
    await waitUntil(wait_for_add_task)
    await waitUntil(() => !addTaskDisabled());
    expect(taskTextShown(task_ids[0], testTaskTextMoreThan150Chars.slice(0, 150))).toBe(true);
}

export async function displays_character_count_limit() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await typeTask(testTaskTextMoreThan150Chars);
    expect(characterCount()).toBe("150/150");
}

export async function character_count_limit_hidden_when_input_is_empty() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    expect(characterCountHidden()).toBe(true);
}

export async function lets_user_tick_tasks() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await typeTask(testTaskText);

    await add_all_tasks_except_one();
    for (const task_id of task_ids) {
        if (task_id !== task_ids[task_ids.length - 1]) {
            const wait_for_tick_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/tick`)
            await tickTask(task_id);
            await waitUntil(wait_for_tick_task)
            await (waitUntil(() => tickTaskHidden(task_id)));
            expect(tickTaskHidden(task_id)).toBe(true);
        }
    }
}

export async function lets_user_carry_tasks() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await typeTask(testTaskText);
    await add_all_tasks();
    await waitUntil( () => !carryTaskHidden(task_ids[0]));
    await carry_all_tasks();
}

export async function lets_user_remove_tasks() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await typeTask(testTaskText);
    await add_all_tasks();
    await waitUntil( () => !removeTaskHidden(task_ids[0]));
    await remove_all_tasks();
}

export async function displays_page_number_of_tasks() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await typeTask(testTaskText);
    await add_all_tasks();
    await carry_all_tasks();
    for (const task_id of task_ids) {
        if (task_id === task_ids[task_ids.length - 1]) {
            await waitUntil(() => taskPageNumber(task_id) === '1')
        }
        expect(taskPageNumber(task_id)).toBe('1');
    }
}

export async function only_shows_remove_tasks_for_tasks_carried_twice() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await typeTask(testTaskText);
    await add_all_tasks();
    await waitUntil( () => !carryTaskHidden(task_ids[0]));
    await carry_all_tasks();
    await carry_all_tasks();
    await waitUntil( () => !removeTaskHidden(task_ids[0]));
    for (const task_id of task_ids) {
        expect(carryTaskHidden(task_id)).toBe(true);
        expect(removeTaskHidden(task_id)).toBe(false);
    }
}

export async function does_not_show_remove_or_carry_for_ticked_tasks() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await typeTask(testTaskText);
    await add_all_tasks_except_one();
    for (const task_id of task_ids) {
        if (task_id !== task_ids[task_ids.length - 1]) {
            const wait_for_tick_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/tick`)
            await tickTask(task_id);
            await waitUntil(wait_for_tick_task)
            await waitUntil(() => tickTaskHidden(task_id));
        }
    }

    for (const task_id of task_ids) {
        if (task_id !== task_ids[task_ids.length - 1]) {
            expect(carryTaskHidden(task_id)).toBe(true);
            expect(removeTaskHidden(task_id)).toBe(true);
        }
    }
}

export async function shows_correct_tasks_when_selecting_a_different_list() {
    const wait_for_get_task_lists = mockServer.get("/tasks-lists", [
        {id: task_list_id, name: task_list_name, tasks: [
            {
                id: task_ids[0],
                content: testTaskText,
                is_ticked: false,
                is_carried: false,
                is_removed: false,
                page_count: 0
            }]},
        {id: another_task_list_id, name: another_task_list_name, tasks: [
            {
                id: task_ids[1],
                content: anotherTestTaskText,
                is_ticked: false,
                is_carried: false,
                is_removed: false,
                page_count: 0
            }]}
    ])
    renderTasksView();
    resetActor();
    await waitForLoadingSpinnerToDisappear();
    await waitUntil(wait_for_get_task_lists)
    await selectOptionFromTaskListSingleSelect(1);
    await waitUntil(() => !tickTaskHidden(task_ids[1]));
    expect(taskTextShown(task_ids[1], anotherTestTaskText)).toBe(true);
    
}
async function add_all_tasks_except_one() {
    for (const task_id of task_ids) {
        const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, {id: task_id})
        if (task_id !== task_ids[task_ids.length - 1]) {
            await addTask();
            await waitUntil(wait_for_add_task)
            await waitUntil(() => !addTaskDisabled());
        }
    }
}

async function add_all_tasks() {
    for (const task_id of task_ids) {
        const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, {id: task_id})
        await addTask();
        await waitUntil(wait_for_add_task)
        if (task_id !== task_ids[task_ids.length - 1]) {
            await waitUntil(() => !addTaskDisabled());
        }
    }
}

async function remove_all_tasks() {
    for (const task_id of task_ids) {
        const wait_for_remove_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/remove`);
        await waitUntil(() => !removeTaskHidden(task_id));
        await removeTask(task_id);
        await waitUntil(wait_for_remove_task);
        await waitUntil(() => removeTaskHidden(task_id));
    }
}

async function carry_all_tasks() {
    for (const task_id of task_ids) {
        await carry_a_task(task_id);
        if (task_id !== task_ids[task_ids.length - 1]) {
            await waitUntil(() => carryTaskHidden(task_id));
        }
    }
}

async function carry_a_task(task_id: string) {
    const wait_for_carry_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/carry`);
    await waitUntil(() => !carryTaskHidden(task_id));
    await carryTask(task_id);
    await waitUntil(wait_for_carry_task);
}

async function waitForLoadingSpinnerToDisappear() {
    await waitUntil(() => !loadingSpinnerExists());
}
