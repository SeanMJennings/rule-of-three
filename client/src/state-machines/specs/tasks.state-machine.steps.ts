import { tasksMachine } from "@/state-machines/tasks.state-machine";
import { afterAll, afterEach, expect } from 'vitest'
import { createActor } from 'xstate'
import { TasksMachineCombinedStates } from "@/state-machines/tasks.states";

const tasks = createActor(tasksMachine);
tasks.start();
const task_list_id = crypto.randomUUID(); 
const task_id = crypto.randomUUID();

afterEach(() => {
  tasks.send({ type: "reset" })
});

afterAll(() => {
  tasks.stop();
});

export function adds_a_task_list() {
  tasks.send({ type: "readyToAddFirstTaskList" });
  tasks.send({ type: "addTasksList", name: "Task list name" });
  expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsEmpty);
  expect(tasks.getSnapshot().context.id).toEqual(task_list_id);
  expect(tasks.getSnapshot().context.name).toEqual("Task list name");
  expect(tasks.getSnapshot().context.tasks).toEqual([]);
  expect(tasks.getSnapshot().context.tasksLists).toEqual([{id: task_id, name: "Task list name" }]);
}

export function updates_a_task_list_name() {
  tasks.send({ type: "readyToAddFirstTaskList" });
  tasks.send({ type: "addTasksList", id: 1, name: "Task list name" });
  tasks.send({ type: "updateTasksList", id: 1, name: "New task list name" });
  expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsEmpty);
  expect(tasks.getSnapshot().context.id).toEqual(1);
  expect(tasks.getSnapshot().context.name).toEqual("New task list name");
  expect(tasks.getSnapshot().context.tasks).toEqual([]);
  expect(tasks.getSnapshot().context.tasksLists).toEqual([{id: 1, name: "New task list name" }]);
}

export function adds_a_task() {
  tasks.send({ type: "readyToAddFirstTaskList" });
  tasks.send({ type: "addTasksList", id: 1, name: "Task list name" });
  tasks.send({ type: "readyToAddFirstTask" });
  tasks.send({ type: "add", content: "Task content" });
  expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
  expect(tasks.getSnapshot().context.tasks).toEqual([{ id: 1, content: "Task content", carried: false, page: 0, ticked: false }]);
}

export function lets_user_tick_off_task() {
  tasks.send({ type: "readyToAddFirstTaskList" });
  tasks.send({ type: "addTasksList", id: 1, name: "Task list name" });
  tasks.send({ type: "readyToAddFirstTask" });
  tasks.send({ type: "add", content: "Task content" });
  tasks.send({ type: "tick", id: 1 });
  expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
  expect(tasks.getSnapshot().context.tasks).toEqual([{ id: 1, content: "Task content", carried: false, page: 0, ticked: true }]);
}

export async function selects_a_different_tasks_list() {
  tasks.send({ type: "readyToAddFirstTaskList" });
  tasks.send({ type: "addTasksList", id: 1, name: "Task list name" });
  tasks.send({ type: "readyToAddFirstTask" });
  tasks.send({ type: "add", content: "Task content" });
  tasks.send({ type: "addTasksList", id: 2, name: "2nd task list name" });
  tasks.send({ type: "selectTasksList", id: 2 });
  expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsEmpty);

  expect(tasks.getSnapshot().context.id).toEqual(2);
  expect(tasks.getSnapshot().context.name).toEqual("2nd task list name");
  expect(tasks.getSnapshot().context.tasks).toEqual([]);
  expect(tasks.getSnapshot().context.tasksLists).toEqual([
    { id: 1, name: "Task list name" },
    { id: 2, name: "2nd task list name" },
  ]);
}

export function adds_22_tasks_and_then_refuses_subsequent_tasks() {
  tasks.send({ type: "readyToAddFirstTaskList" });
  tasks.send({ type: "addTasksList", id: 1, name: "Task list name" });
  tasks.send({ type: "readyToAddFirstTask" });
  for (let i = 0; i < 22; i++) {
    tasks.send({ type: "add", content: "Task content", page: 0 });
  }
  expect(tasks.getSnapshot().context.tasks.length).toEqual(22);
  expect(tasks.getSnapshot().value).toStrictEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export function lets_user_carry_tasks() {
  tasks.send({ type: "readyToAddFirstTaskList" });
  tasks.send({ type: "addTasksList", id: 1, name: "Task list name" });
  tasks.send({ type: "readyToAddFirstTask" });
  for (let i = 0; i < 22; i++) {
    tasks.send({ type: "add", content: "Task content" });
  }
  for (let i = 0; i < 22; i++) {
    tasks.send({ type: "carry", id: i + 1 });
  }
  expect(tasks.getSnapshot().context.tasks.filter((n) => n.page === 1).length).toEqual(22);
  expect(tasks.getSnapshot().context.tasks.filter((n) => n.carried === false).length).toEqual(22);
  expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export function removes_ticked_tasks_when_all_tasks_are_carried() {
  tasks.send({ type: "readyToAddFirstTaskList" });
  tasks.send({ type: "addTasksList", id: 1, name: "Task list name" });
  tasks.send({ type: "readyToAddFirstTask" });
  for (let i = 0; i < 20; i++) {
    tasks.send({ type: "add", content: "Task content" });
  }
  tasks.send({ type: "tick", id: 19 });
  tasks.send({ type: "tick", id: 20 });
  tasks.send({ type: "add", content: "Task content" });
  tasks.send({ type: "add", content: "Task content" });

  for (let i = 0; i < 22; i++) {
    tasks.send({ type: "carry", id: i + 1 });
  }
  
  expect(tasks.getSnapshot().context.tasks.length).toEqual(20);
  expect(tasks.getSnapshot().context.tasks.filter((n) => n.page === 1).length).toEqual(20);
  expect(tasks.getSnapshot().context.tasks.filter((n) => n.carried === false).length).toEqual(20);
  expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
}

export function lets_user_remove_tasks() {
  tasks.send({ type: "readyToAddFirstTaskList" });
  tasks.send({ type: "addTasksList", id: 1, name: "Task list name" });
  tasks.send({ type: "readyToAddFirstTask" });
  for (let i = 0; i < 22; i++) {
    tasks.send({ type: "add", content: "Task content" });
  }
  for (let i = 0; i < 22; i++) {
    tasks.send({ type: "remove", id: i + 1 });
  }
  expect(tasks.getSnapshot().context.tasks.length).toEqual(0);
  expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsAddingTasks);
}

export function lets_user_carry_tasks_maximum_twice() {
  tasks.send({ type: "readyToAddFirstTaskList" });
  tasks.send({ type: "addTasksList", id: 1, name: "Task list name" });
  tasks.send({ type: "readyToAddFirstTask" });
  for (let i = 0; i < 22; i++) {
    tasks.send({ type: "add", content: "Task content" });
  }
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 22; i++) {
      tasks.send({ type: "carry", id: i + 1 });
    }
  }
  expect(tasks.getSnapshot().context.tasks.filter((n) => n.page === 2).length).toEqual(22);
  expect(tasks.getSnapshot().context.tasks.filter((n) => n.carried === false).length).toEqual(22);
  expect(tasks.getSnapshot().value).toEqual(TasksMachineCombinedStates.addingTasksListsChoosingTasksToCarry);
}

export function selecting_a_tasks_list_resets_the_tasks() {
  tasks.send({ type: "readyToAddFirstTaskList" });
  tasks.send({ type: "addTasksList", id: 1, name: "Task list name" });
  tasks.send({ type: "addTasksList", id: 2, name: "2nd task list name" });
  tasks.send({ type: "readyToAddFirstTask" });
  for (let i = 0; i < 22; i++) {
    tasks.send({ type: "add", content: "Task content" });
  }
  tasks.send({ type: "selectTasksList", id: 2 });

  expect(tasks.getSnapshot().context.tasks.length).toEqual(0);
}
