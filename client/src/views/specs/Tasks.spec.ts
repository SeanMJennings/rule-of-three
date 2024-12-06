import {describe, it} from "vitest";
import {
    adds_and_lists_a_task,
    allows_owner_to_share_a_task_list,
    asks_user_to_create_first_task_list,
    character_count_limit_hidden_when_input_is_empty,
    closes_a_modal_to_share_a_task_list,
    disables_add_a_task_list_whilst_adding,
    disables_add_task_button_when_input_is_empty,
    disables_add_task_button_whilst_adding,
    displays_character_count_limit,
    displays_list_character_count_limit,
    displays_loading_spinner_until_task_lists_are_loaded,
    displays_overlay_modal_for_validation_errors,
    displays_page_number_of_tasks,
    does_not_allow_a_sharer_to_share_a_task_list,
    does_not_show_remove_or_carry_for_ticked_tasks,
    ensures_add_and_select_tasks_list_are_closed_if_a_task_list_is_loaded,
    lets_user_add_a_task_list,
    lets_user_carry_tasks,
    lets_user_close_delete_task_list_modal,
    lets_user_close_edit_task_list_name_modal,
    lets_user_close_overlay_modal_for_validation_errors,
    lets_user_collapse_tasks_list_input,
    lets_user_collapse_tasks_list_single_select,
    lets_user_delete_a_task_list,
    lets_user_expand_tasks_list_input,
    lets_user_expand_tasks_list_single_select,
    lets_user_remove_tasks,
    lets_user_rename_a_task_list,
    lets_user_tick_tasks,
    lets_user_tick_tasks_during_choosing,
    limits_edit_task_list_name_input_to_50_characters,
    limits_task_length_to_150_characters,
    list_character_count_limit_hidden_when_input_is_empty,
    only_shows_remove_tasks_for_tasks_carried_twice,
    opens_a_modal_to_share_a_task_list,
    renders_tasks,
    selects_newest_of_multiple_lists,
    shows_correct_tasks_when_selecting_a_different_list,
    shows_task_count_if_there_are_tasks,
    shows_task_list_single_select_when_there_is_one_list
} from '@/views/specs/Tasks.steps'

describe("Tasks", () => {
    describe("Task List", () => {
        it("displays loading spinner until task lists are loaded", displays_loading_spinner_until_task_lists_are_loaded);
        it("asks user to create first task list", asks_user_to_create_first_task_list);
        it("lets user add a task list", lets_user_add_a_task_list);
        it("disables add a task list whilst adding", disables_add_a_task_list_whilst_adding);
        it("displays list character count limit", displays_list_character_count_limit);
        it("list character count limit hidden when input is empty", list_character_count_limit_hidden_when_input_is_empty);
        it("lets user collapse tasks list input", lets_user_collapse_tasks_list_input);
        it("ensures add and select task list are closed if a task list is loaded", ensures_add_and_select_tasks_list_are_closed_if_a_task_list_is_loaded);
        it("lets user expand tasks list input", lets_user_expand_tasks_list_input);
        it("shows task list single select when there is one list", shows_task_list_single_select_when_there_is_one_list);
        it("lets user delete a task list", lets_user_delete_a_task_list);
        it("lets user close delete task list modal", lets_user_close_delete_task_list_modal);
        it("lets user rename a task list", lets_user_rename_a_task_list);
        it("limits edit task list name input to 50 characters", limits_edit_task_list_name_input_to_50_characters);
        it("lets user close edit task list name modal", lets_user_close_edit_task_list_name_modal);
        it("lets user collapse tasks list single select", lets_user_collapse_tasks_list_single_select);
        it("lets user expand tasks list single select", lets_user_expand_tasks_list_single_select);
        it("selects newest of multiple lists", selects_newest_of_multiple_lists);
        it("displays overlay modal for validation errors", displays_overlay_modal_for_validation_errors);
        it("lets user close overlay modal for validation errors", lets_user_close_overlay_modal_for_validation_errors);
    });
    describe("Tasks", () => {
        it("renders tasks", renders_tasks);
        it("disables add task button when input is empty", disables_add_task_button_when_input_is_empty);
        it("adds and lists a task", adds_and_lists_a_task);
        it("disables add task button whilst adding", disables_add_task_button_whilst_adding);
        it("shows task count if there are tasks", shows_task_count_if_there_are_tasks);
        it("limits task length to 150 characters", limits_task_length_to_150_characters);
        it("displays character count limit", displays_character_count_limit);
        it("character count limit hidden when input is empty", character_count_limit_hidden_when_input_is_empty);
        it("lets user tick tasks", lets_user_tick_tasks);
        it("lets user carry tasks", lets_user_carry_tasks);
        it("lets user remove tasks", lets_user_remove_tasks, 10000);
        it("lets user tick tasks during choosing", lets_user_tick_tasks_during_choosing);
        it("displays page number of tasks", displays_page_number_of_tasks, 10000);
        it("does not show remove or carry for ticked tasks", does_not_show_remove_or_carry_for_ticked_tasks);
        it("only shows remove tasks for tasks carried twice", only_shows_remove_tasks_for_tasks_carried_twice, 10000);
        it("shows correct tasks when selecting a different list", shows_correct_tasks_when_selecting_a_different_list);
    });
    describe("Sharing", () => {
        it("opens a modal to share a task list", opens_a_modal_to_share_a_task_list);
        it("allows owner to share a task list", allows_owner_to_share_a_task_list);
        it("closes a modal to share a task list", closes_a_modal_to_share_a_task_list);
        it("does not allow a sharer to share a task list", does_not_allow_a_sharer_to_share_a_task_list);
    })
});
