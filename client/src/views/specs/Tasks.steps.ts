import {afterEach, beforeEach, expect, vi} from 'vitest'
import {
    addAnotherTaskList,
    addATaskList,
    addTask,
    addTaskDisabled, addTaskInputText,
    addTaskListSubmitDisabled,
    addTaskVisible,
    carryTask,
    carryTaskHidden,
    characterCount,
    characterCountHidden,
    clickAddTaskListPlaceholder, closeDeleteTaskList,
    closeEditTaskListName,
    closeErrorOverlay, closerShareTaskList,
    deleteTaskList, deleteTaskListModalExists, editTaskListNameCharacterCount,
    editTaskListNameModalExists,
    errorOverlayExists,
    errorOverlayText,
    loadingSpinnerExists, openDeleteTaskList,
    openEditTaskListName, openShareTaskList,
    pageText,
    removeTask,
    removeTaskHidden,
    renderTasksView,
    selectOptionFromTaskListSingleSelect, shareTaskListExists,
    submitNewTaskListName,
    taskCount,
    taskCountHidden,
    taskListCharacterCount,
    taskListCharacterCountHidden,
    taskListNameInputText,
    taskListSingleSelectChosenValue,
    taskListSingleSelectHidden,
    taskListSingleSelectText,
    taskPageNumber,
    tasksListCaretExists,
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
    typeNewTaskListName,
    typeTask,
    typeTaskListName,
    unmountTasksView
} from './Tasks.page'
import {
    task_list_id,
    task_list_name,
    another_task_list_id,
    another_task_list_name,
    add_task_list_response,
    another_add_task_list_response,
    task_ids,
    add_task_list_response_with_tasks,
    another_add_task_list_response_with_tasks, task_id, another_email_to_share
} from "@/state-machines/specs/tasks.api-mocks";
import {MockServer} from "@/testing/mock-server";
import {reducedTaskLimit, waitUntil} from "@/testing/utilities";
import {login, mockAuth0, resetAuth0, userIsAuthenticated} from "@/testing/mock-auth0";
import exp from "node:constants";

const testTaskText = "Hello, world!";

const testTaskTextMoreThan150Chars =
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis_pa";
const mockServer = MockServer.New();
let wait_for_create_tasks_list: () => boolean;

vi.mock("@lottiefiles/dotlottie-vue", () => {
    return {DotLottieVue: {template: "<div>I am a fake!</div>"}};
});

vi.mock('@auth0/auth0-vue', () => ({
    useAuth0: () => mockAuth0,
    authGuard: () => userIsAuthenticated()
}));

beforeEach(() => {
    mockServer.reset();
    mockServer.get("/tasks-lists", [])
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", add_task_list_response)
    resetAuth0();
    window.token = undefined;
    mockServer.start()
});

afterEach(() => {
    unmountTasksView();
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
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", add_task_list_response)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
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
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", add_task_list_response)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    const wait_for_delete_tasks_list = mockServer.delete(`/tasks-lists/${task_list_id}`)
    await openDeleteTaskList()
    await deleteTaskList()
    await waitUntil(wait_for_delete_tasks_list);
    await waitUntil(() => taskListSingleSelectHidden());
    expect(pageText()).toContain("Create your first task list");
}

export async function lets_user_close_delete_task_list_modal() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", add_task_list_response)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    await openDeleteTaskList();
    await closeDeleteTaskList();
    expect(deleteTaskListModalExists()).toBe(false);
    expect(taskListSingleSelectHidden()).toBe(false);
}

export async function lets_user_rename_a_task_list() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", add_task_list_response)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    const wait_for_rename_tasks_list = mockServer.patch(`/tasks-lists/${task_list_id}`, {name: another_task_list_name})
    await openEditTaskListName()
    await typeNewTaskListName(another_task_list_name);
    await submitNewTaskListName();
    await waitUntil(wait_for_rename_tasks_list);
    expect(editTaskListNameModalExists()).toBe(false);
    await waitUntil(() => taskListSingleSelectText(task_list_id) === another_task_list_name);
    expect(taskListSingleSelectText(task_list_id)).toBe(another_task_list_name);
}

export async function limits_edit_task_list_name_input_to_50_characters() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    await openEditTaskListName()
    await typeNewTaskListName(testTaskTextMoreThan150Chars);
    expect(editTaskListNameCharacterCount()).toBe("50/50");
}

export async function lets_user_close_edit_task_list_name_modal() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", add_task_list_response)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    await openEditTaskListName()
    await closeEditTaskListName();
    expect(editTaskListNameModalExists()).toBe(false);
}

export async function lets_user_collapse_tasks_list_single_select() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", another_add_task_list_response)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
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
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", another_add_task_list_response)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    await addAnotherTaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    await toggleTasksListSingleSelect();
    expect(tasksListSingleSelectCollapsed()).toBe(false);
    expect(tasksListSingleSelectCaretPointsDown()).toBe(false);
}

export async function selects_newest_of_multiple_lists() {
    const wait_for_get_task_lists = mockServer.get("/tasks-lists", [
        add_task_list_response,
        another_add_task_list_response
    ])
    mockServer.patch(`/tasks-lists/${another_task_list_id}/last-selected-time`, {})
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await waitUntil(wait_for_get_task_lists)
    await toggleTasksListSingleSelect();
    expect(taskListSingleSelectChosenValue()).toBe(another_task_list_id);
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

export async function disables_add_a_task_list_whilst_adding() {
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", add_task_list_response, true, 1000)
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await typeTaskListName(task_list_name);
    expect(addTaskListSubmitDisabled()).toBe(true);
    await waitUntil(wait_for_create_tasks_list)
    expect(addTaskListSubmitDisabled()).toBe(false);
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

export async function ensures_add_and_select_tasks_list_are_closed_if_a_task_list_is_loaded() {
    const wait_for_get_task_lists = mockServer.get("/tasks-lists", [
        add_task_list_response
    ])
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await waitUntil(wait_for_get_task_lists);
    await waitUntil(() => tasksListCaretExists());
    expect(tasksListInputCollapsed()).toBe(true);
    expect(tasksListInputCaretPointsDown()).toBe(true);
    expect(tasksListSingleSelectCollapsed()).toBe(true);
    expect(tasksListSingleSelectCaretPointsDown()).toBe(true);
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
    expect(addTaskInputText()).toBe("");
}

export async function disables_add_task_button_whilst_adding() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, { id: task_ids[0] }, true, 1000)
    await typeTask(testTaskText);
    await addTask();
    expect(addTaskDisabled()).toBe(true);
    await waitUntil(wait_for_add_task)
    expect(addTaskDisabled()).toBe(false);
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
    await add_all_tasks();
    await waitUntil( () => !removeTaskHidden(task_ids[0]));
    await remove_all_tasks();
}

export async function lets_user_tick_tasks_during_choosing() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await add_all_tasks();
    await waitUntil( () => !carryTaskHidden(task_ids[0]));
    for (const task_id of task_ids) {
        if (task_id !== task_ids[task_ids.length - 1]) {
            const wait_for_tick_task = mockServer.patch(`/tasks-lists/${task_list_id}/task/${task_id}/tick`)
            await tickTask(task_id);
            await waitUntil(wait_for_tick_task)
            await (waitUntil(() => tickTaskHidden(task_id)));
            expect(tickTaskHidden(task_id)).toBe(true);
        }
    }

    for (const task_id of task_ids) {
        if (task_id !== task_ids[task_ids.length - 1]) {
            expect(carryTaskHidden(task_id)).toBe(true);
            expect(removeTaskHidden(task_id)).toBe(true);
            expect(tickTaskHidden(task_id)).toBe(true);
        }
    }
}

export async function displays_page_number_of_tasks() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();
    await waitUntil(wait_for_create_tasks_list)
    await waitUntil(() => !addTaskListSubmitDisabled());
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
        add_task_list_response_with_tasks,
        another_add_task_list_response_with_tasks
    ])
    mockServer.patch(`/tasks-lists/${another_task_list_id}/last-selected-time`, {})
    const wait_for_update_last_selected_time = mockServer.patch(`/tasks-lists/${task_list_id}/last-selected-time`, {})
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await waitUntil(wait_for_get_task_lists);
    await toggleTasksListSingleSelect();
    await selectOptionFromTaskListSingleSelect(1);
    await waitUntil(wait_for_update_last_selected_time);
    await waitUntil(() => !tickTaskHidden(task_id));
    expect(taskTextShown(task_id, "Task content")).toBe(true);
    
}

export async function allows_owner_to_share_a_task_list() {
    await login();
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();    
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", add_task_list_response)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    expect(await shareTaskListExists()).toBe(true);
}

export async function opens_a_modal_to_share_a_task_list() {
    await login();
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();    
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", add_task_list_response)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    await openShareTaskList();
    expect(pageText()).toContain("Share tasks list");
}

export async function closes_a_modal_to_share_a_task_list() {
    await login();
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();    
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", add_task_list_response)
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    await openShareTaskList();
    await closerShareTaskList();
    expect(pageText()).not.toContain("Share tasks list");
}

export async function does_not_allow_a_sharer_to_share_a_task_list() {
    renderTasksView();
    await waitForLoadingSpinnerToDisappear();
    await addATaskList();    
    await waitUntil(wait_for_create_tasks_list)
    wait_for_create_tasks_list = mockServer.post("/tasks-lists", {
        ...add_task_list_response,
        owner_email: another_email_to_share
    })
    await waitUntil(() => !addTaskListSubmitDisabled());
    await toggleTasksListSingleSelect();
    expect(await shareTaskListExists()).toBe(false);
}

async function add_all_tasks_except_one() {
    for (const task_id of task_ids) {
        const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, {id: task_id})
        if (task_id !== task_ids[task_ids.length - 1]) {
            await typeTask(testTaskText);
            await addTask();
            await waitUntil(wait_for_add_task)
            await waitUntil(() => !addTaskDisabled());
        }
    }
}

async function add_all_tasks() {
    for (const task_id of task_ids) {
        const wait_for_add_task = mockServer.post(`/tasks-lists/${task_list_id}/task`, {id: task_id})
        await typeTask(testTaskText);
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
