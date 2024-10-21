import {describe, it} from "vitest";
import {
    adds_maximum_tasks_and_then_refuses_subsequent_tasks,
    adds_a_task,
    adds_a_task_list,
    adds_two_task_lists,
    lets_user_carry_tasks,
    lets_user_remove_tasks,
    lets_user_tick_off_task,
    loads_a_task_list,
    removes_ticked_tasks_when_all_tasks_are_carried,
    selecting_a_different_tasks_list_retrieves_correct_tasks,
    selects_a_different_tasks_list,
    updates_a_task_list_name, cannot_carry_tasks_past_two_pages
} from '@/state-machines/specs/tasks.state-machine.steps'

describe("Tasks state machine", () => {
    describe("Tasks lists", () => {
        it("adds a task list", adds_a_task_list);
        it("loads a task list", loads_a_task_list);
        it("adds two task lists", adds_two_task_lists);
        it("updates a task list name", updates_a_task_list_name);
        it("selects a different tasks list", selects_a_different_tasks_list);
    });
    describe("Tasks", () => {
        it("adds a task", adds_a_task);
        it("lets user tick off task", lets_user_tick_off_task);
        it("adds maximum tasks and then refuses subsequent tasks", adds_maximum_tasks_and_then_refuses_subsequent_tasks);
        it("lets user carry tasks", lets_user_carry_tasks);
        it('removes ticked tasks when all tasks are carried', removes_ticked_tasks_when_all_tasks_are_carried, 10000);
        it("lets user remove tasks", lets_user_remove_tasks);
        it("cannot carry tasks past two pages", cannot_carry_tasks_past_two_pages, 10000);
        it("selecting a different tasks list retrieves correct tasks", selecting_a_different_tasks_list_retrieves_correct_tasks, 10000);
    });
});
