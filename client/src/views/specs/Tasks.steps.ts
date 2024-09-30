import { afterAll, afterEach, expect } from 'vitest'
import {
  addFirstTaskHidden,
  addTask,
  addTaskVisible,
  carryTask,
  carryTaskHidden,
  characterCount,
  characterCountHidden,
  clickAddFirstTask,
  taskCount,
  taskCountHidden,
  taskPageNumber,
  taskVisible,
  pageText,
  removeTask,
  removeTaskHidden,
  renderTasksView,
  typeTask,
  taskListNameInputText,
  taskListSingleSelectChosenValue,
  taskListSingleSelectHidden,
  unmountTasksView,
  addATaskList,
  stopActor,
  addAnotherTaskList,
  toggleTasksListInput,
  tasksListInputCollapsed,
  tasksListInputCaretPointsDown,
  tasksListInputCaretPointsUp,
  toggleTasksListSingleSelect,
  tasksListSingleSelectCollapsed,
  tasksListSingleSelectCaretPointsDown,
  clickAddTaskListPlaceholder,
  typeTaskListName,
  taskListCharacterCount, taskListCharacterCountHidden, tickTask, tickTaskHidden
} from './Tasks.page'

const testTaskText = "Hello, world!";
const testTaskTextMoreThan150Chars =
  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis_pa";

afterEach(() => {
  unmountTasksView();
});

afterAll(() => {
  stopActor();
});

export async function renders_tasks() {
  renderTasksView();
  await addATaskList();
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
  await addAnotherTaskList();
  expect(taskListSingleSelectHidden()).toBe(false);
  expect(pageText()).not.toContain("Create your first task list");
  expect(taskListSingleSelectChosenValue()).toBe("1");
  expect(taskListNameInputText()).toBe("");
}

export async function lets_user_collapse_tasks_list_single_select() {
  renderTasksView();
  await addATaskList();
  await addAnotherTaskList();
  await toggleTasksListSingleSelect();
  expect(tasksListSingleSelectCollapsed()).toBe(true);
  expect(tasksListSingleSelectCaretPointsDown()).toBe(true);
}

export async function lets_user_expand_tasks_list_single_select() {
  renderTasksView();
  await addATaskList();
  await addAnotherTaskList();
  await toggleTasksListSingleSelect();
  await toggleTasksListSingleSelect();
  expect(tasksListSingleSelectCollapsed()).toBe(false);
  expect(tasksListSingleSelectCaretPointsDown()).toBe(false);
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
  await toggleTasksListInput();
  expect(tasksListInputCollapsed()).toBe(true);
  expect(tasksListInputCaretPointsDown()).toBe(true);
}

export async function lets_user_expand_tasks_list_input() {
  renderTasksView();
  await addATaskList();
  await toggleTasksListInput();
  await toggleTasksListInput();
  expect(tasksListInputCollapsed()).toBe(false);
  expect(tasksListInputCaretPointsUp()).toBe(true);
}

export async function removes_add_first_task_placeholder_on_click() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  expect(addFirstTaskHidden()).toBe(true);
  expect(addTaskVisible()).toBe(true);
}

export async function shows_task_count_if_there_are_tasks() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  expect(taskCountHidden()).toBe(true);
  await typeTask(testTaskText);
  await addTask();
  expect(taskCount()).toBe("1/22 tasks");
}

export async function disables_add_task_button_when_input_is_empty() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  await addTask();
  expect(addTaskVisible()).toBe(true);
}

export async function adds_and_lists_a_task() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  await typeTask(testTaskText);
  await addTask();
  expect(addTaskVisible()).toBe(true);
  expect(taskVisible(1, testTaskText)).toBe(true);
}

export async function limits_task_length_to_150_characters() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  await typeTask(testTaskTextMoreThan150Chars);
  await addTask();
  expect(addTaskVisible()).toBe(true);
  expect(taskVisible(1, testTaskTextMoreThan150Chars.slice(0, 150))).toBe(true);
}

export async function displays_character_count_limit() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  await typeTask(testTaskTextMoreThan150Chars);
  expect(characterCount()).toBe("150/150");
}

export async function character_count_limit_hidden_when_input_is_empty() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  expect(characterCountHidden()).toBe(true);
}

export async function lets_user_tick_tasks() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  await typeTask(testTaskText);
  for (let i = 0; i < 21; i++) {
    await addTask();
  }
  for (let i = 0; i < 21; i++) {
    await tickTask(i + 1);
    expect(tickTaskHidden(i + 1)).toBe(true);
  }
}

export async function lets_user_carry_tasks() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  await typeTask(testTaskText);
  for (let i = 0; i < 22; i++) {
    await addTask();
  }
  for (let i = 0; i < 22; i++) {
    await carryTask(i + 1);
    expect(carryTaskHidden(i + 1)).toBe(i != 21);
  }
}

export async function lets_user_remove_tasks() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  await typeTask(testTaskText);
  for (let i = 0; i < 22; i++) {
    await addTask();
  }
  for (let i = 0; i < 22; i++) {
    await removeTask(i + 1);
    expect(removeTaskHidden(i + 1)).toBe(true);
  }
}

export async function displays_page_number_of_tasks() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  await typeTask(testTaskText);
  for (let i = 0; i < 22; i++) {
    await addTask();
  }
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 22; i++) {
      expect(taskPageNumber(i + 1)).toBe(j.toString());
      await carryTask(i + 1);
      expect(taskPageNumber(i + 1)).toBe((j + 1).toString());
    }
  }
}

export async function only_shows_remove_tasks_for_tasks_carried_twice() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  await typeTask(testTaskText);
  for (let i = 0; i < 22; i++) {
    await addTask();
  }
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 22; i++) {
      await carryTask(i + 1);
    }
  }
  for (let i = 0; i < 22; i++) {
    expect(carryTaskHidden(i + 1)).toBe(true);
    expect(removeTaskHidden(i + 1)).toBe(false);
  }
}

export async function does_not_show_remove_or_carry_for_ticked_tasks() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  await typeTask(testTaskText);
  for (let i = 0; i < 20; i++) {
    await addTask();
  }
  for (let i = 0; i < 20; i++) {
    await tickTask(i + 1);
  }
  await addTask();
  await addTask();
  for (let i = 0; i < 20; i++) {
    expect(carryTaskHidden(i + 1)).toBe(true);
    expect(removeTaskHidden(i + 1)).toBe(true);
  }
}

export async function resets_tasks_when_different_tasks_list_selected() {
  renderTasksView();
  await addATaskList();
  await clickAddFirstTask();
  await typeTask(testTaskText);
  for (let i = 0; i < 22; i++) {
    await addTask();
  }
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 22; i++) {
      await carryTask(i + 1);
    }
  }
  for (let i = 0; i < 22; i++) {
    expect(carryTaskHidden(i + 1)).toBe(true);
    expect(removeTaskHidden(i + 1)).toBe(false);
  }
}
