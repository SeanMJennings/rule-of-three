import {mount, VueWrapper} from "@vue/test-utils";
import Tasks from "../Tasks.vue";
import {useMachine} from '@xstate/vue'
import {tasksMachine} from '@/state-machines/tasks.state-machine'

let page: VueWrapper;

// @ts-ignore
HTMLCanvasElement.prototype.getContext = () => {};
import {task_list_name, another_task_list_name} from "@/state-machines/specs/tasks.api-mocks";


export function renderTasksView() {
    page = mountTasksView();
}


export function unmountTasksView() {
    page.unmount();
}

export function pageText() {
    return page.text();
}

export function loadingSpinnerExists() {
    return elements.loadingSpinner.exists();
}

export function clickAddTaskListPlaceholder() {
    return elements.addTaskListPlaceholder.trigger("click");
}

export function clickTasksListCaret() {
    return elements.tasksListCaret.trigger("click");
}

export function tasksListCaretExists() {
    return elements.tasksListCaret.exists();
}

export function clickTasksListSingleSelectCaret() {
    return elements.tasksListSelectCaret.trigger("click");
}

export function typeTaskListName(value: string) {
    return elements.addTaskListInput.setValue(value);
}

export function openEditTaskListName() {
    return elements.openEditTaskListName.trigger("click");
}

export function openDeleteTaskList() {
    return elements.openDeleteTaskList.trigger("click");
}

export function closeDeleteTaskList() {
    return elements.closeModal.trigger("click");
}

export function closeEditTaskListName() {
    return elements.closeModal.trigger("click");
}

export function editTaskListNameModalExists() {
    return elements.editTaskListNameModal.exists();
}

export function deleteTaskListModalExists() {
    return elements.deleteTaskListNameModal.exists();
}

export function typeNewTaskListName(value: string) {
    return elements.editTaskListNameInput.setValue(value);
}

export function submitNewTaskListName() {
    return elements.editTaskListNameSubmit.trigger("click");
}

export function taskListNameInputText() {
    return (elements.addTaskListInput.element as HTMLInputElement).value;
}

export function taskListSingleSelectHidden() {
    return !elements.queryTaskListSingleSelect().exists();
}

export function taskListSingleSelectChosenValue() {
    return elements.taskListSingleSelect.value;
}

export async function selectOptionFromTaskListSingleSelect(index: number) {
    const options = elements.taskListSingleSelectOptions
    await options.at(index)?.setValue()
}


export function taskListSingleSelectText(id: string) {
    const options = elements.taskListSingleSelectOptions
    return options.find(o => o.element.value === id)?.text()
}

export function addTaskListSubmit() {
    return elements.addTaskListSubmit.trigger("click");
}

export function deleteTaskList() {
    return elements.deleteTaskListSubmit.trigger("click");
}

export function addTaskListSubmitDisabled() {
    return (elements.addTaskListSubmit.element as HTMLButtonElement).disabled;
}

export async function addATaskList() {
    await clickAddTaskListPlaceholder();
    await typeTaskListName(task_list_name);
    await addTaskListSubmit();
}

export function errorOverlayExists() {
    return elements.errorOverlay.exists();
}

export function errorOverlayText() {
    return elements.errorOverlay.text();
}

export function closeErrorOverlay() {
    return elements.errorOverlayClose.trigger("click");
}

export async function toggleTasksListInput() {
    await clickTasksListCaret();
}

export async function toggleTasksListSingleSelect() {
    await clickTasksListSingleSelectCaret();
}

export async function addAnotherTaskList() {
    await typeTaskListName(another_task_list_name);
    await addTaskListSubmit();
}

export function tasksListInputCollapsed() {
    return !elements.addTaskListInput.exists();
}

export function tasksListSingleSelectCollapsed() {
    return !elements.queryTaskListSingleSelect().exists();
}

export function tasksListSingleSelectCaretPointsDown() {
    return !elements.tasksListSelectCaret.classes().includes("fa-rotate-180");
}

export function tasksListInputCaretPointsDown() {
    return !elements.tasksListCaret.classes().includes("fa-rotate-180");
}

export function tasksListInputCaretPointsUp() {
    return !tasksListInputCaretPointsDown();
}

export function taskCountHidden() {
    return !elements.taskCount.exists();
}

export function taskCount() {
    return elements.taskCount.text();
}

export function addTaskVisible() {
    return elements.addTask.exists();
}

export function typeTask(task: string) {
    return elements.addTaskInput.setValue(task);
}

export function addTaskInputText() {
    return (elements.addTaskInput.element as HTMLInputElement).value;
}

export function addTask() {
    return elements.addTaskSubmit.trigger("click");
}

export function addTaskDisabled() {
    return elements.addTaskSubmit.exists() ? (elements.addTaskSubmit.element as HTMLButtonElement)?.disabled : true;
}

export function taskTextShown(taskId: string | number, task: string) {
    return elements.taskId(taskId).text() === task;
}

export function taskListCharacterCount() {
    return elements.taskListCharacterCount.text();
}

export function editTaskListNameCharacterCount() {
    return elements.editTaskListNameCharacterCount.text();
}

export function characterCount() {
    return elements.characterCount.text();
}

export function taskListCharacterCountHidden() {
    return elements.taskListCharacterCount.text() === "";
}

export function characterCountHidden() {
    return elements.characterCount.text() === "";
}

export async function carryTask(taskId: string | number) {
    return elements.taskCarry(taskId).trigger("click");
}

export async function tickTask(taskId: string | number) {
    return elements.taskTick(taskId).trigger("click");
}

export async function removeTask(taskId: string | number) {
    return elements.taskRemove(taskId).trigger("click");
}

export function tickTaskHidden(taskId: string | number) {
    return !elements.taskTick(taskId).exists();
}

export function carryTaskHidden(taskId: string | number) {
    return !elements.taskCarry(taskId).exists();
}

export function taskPageNumber(taskId: string | number) {
    return elements.taskPage(taskId).text();
}

export function removeTaskHidden(taskId: string | number) {
    return !elements.taskRemove(taskId).exists();
}

export async function shareTaskListExists() {
    return elements.openShareTaskList.exists();
}

export async function openShareTaskList() {
    return elements.openShareTaskList.trigger("click");
}

export function debug() {
    console.log(page.html());
}

export async function typeShareTaskList(value: string) {
    return elements.shareTaskListInput.setValue(value);
}

export async function submitShareTaskList() {
    return elements.shareTaskListSubmit.trigger("click");
}

export async function closerShareTaskList() {
    return elements.closeModal.trigger("click");
}

export function sharerExists(email: string) {
    return elements.sharer(email.replace('@', '').replace('.', '')).exists();
}

function mountTasksView() {
    return mount(Tasks, {
        props: {
            tasksMachineProvider: () => {
                const {snapshot, send, actorRef} = useMachine(tasksMachine);
                actorRef.start();
                send({type: "reset"});
                return {snapshot: snapshot as any, send, actorRef};
            }
        }
    });
}

const elements = {
    get loadingSpinner() {
        return page.find("#loadingSpinner");
    },
    get addTaskListPlaceholder() {
        return page.find("#add-task-list-placeholder");
    },
    get tasksListCaret() {
        return page.find("#tasks-list-input-caret");
    },
    get tasksListSelectCaret() {
        return page.find("#tasks-list-select-caret");
    },
    get addTaskListInput() {
        return page.find("#add-task-list-input");
    },
    get addTaskListSubmit() {
        return page.find("#add-task-list-submit");
    },
    get errorOverlay() {
        return page.find("#overlay");
    },
    get errorOverlayClose() {
        return page.find("#overlay-close");
    },
    get deleteTaskListSubmit() {
        return page.find("#delete-task-list-submit");
    },
    get openEditTaskListName() {
        return page.find("#open-edit-task-list-name");
    },
    get openDeleteTaskList() {
        return page.find("#open-delete-task-list");
    },
    get openShareTaskList() {
        return page.find("#open-share-task-list");
    },
    get closeModal() {
        return page.find("#overlay-close");
    },
    get editTaskListNameModal() {
        return page.find("#edit-task-list-name-modal");
    },
    get deleteTaskListNameModal() {
        return page.find("#delete-task-list-modal");
    },
    get editTaskListNameInput() {
        return page.find("#edit-task-list-name-input");
    },
    get editTaskListNameSubmit() {
        return page.find("#edit-task-list-name-submit");
    },
    get shareTaskListInput() {
        return page.find("#share-task-list-input");
    },
    get shareTaskListSubmit() {
        return page.find("#share-task-list-submit");
    },
    sharer(email: string) {
        return page.find((('#' + email).replace('@', '').replace('.', '')));
    },
    get taskListSingleSelect() {
        return page.find("#task-list-single-select").element as HTMLSelectElement;
    },
    get taskListSingleSelectOptions() {
        return page.find("#task-list-single-select").findAll('option')
    },
    queryTaskListSingleSelect() {
        return page.find("#task-list-single-select");
    },
    get taskCount() {
        return page.find("#task-count");
    },
    get addTask() {
        return page.find("#add-task");
    },
    get addTaskInput() {
        return page.find("#add-task-input");
    },
    get addTaskSubmit() {
        return page.find("#add-task-submit");
    },
    get taskListCharacterCount() {
        return page.find("#tasks-list-character-count");
    },
    get editTaskListNameCharacterCount() {
        return page.find("#edit-task-list-name-character-count");
    },
    get characterCount() {
        return page.find("#character-count");
    },
    taskId(taskId: string | number) {
        return page.find(`#task-${taskId}`);
    },
    taskTick(taskId: string | number) {
        return page.find(`#task-${taskId}-tick`);
    },
    taskCarry(taskId: string | number) {
        return page.find(`#task-${taskId}-carry`);
    },
    taskRemove(taskId: string | number) {
        return page.find(`#task-${taskId}-remove`);
    },
    taskPage(taskId: string | number) {
        return page.find(`#task-${taskId}-page`);
    },
};
