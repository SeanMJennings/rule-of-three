import {reducedTaskLimit} from "@/testing/utilities";
import type {apiTask} from "@/apis/tasks_list.api";

export const task_list_id = crypto.randomUUID();
export const another_task_list_id = crypto.randomUUID();
export const task_id = crypto.randomUUID();
export const task_list_name = "Task list name";
export const new_task_list_name = "New task list name";
export const another_task_list_name = "2nd task list name";
export const task_ids = Array.from({length: reducedTaskLimit}, () => crypto.randomUUID());
export const another_set_of_task_ids = Array.from({length: reducedTaskLimit}, () => crypto.randomUUID());
export const newest_date = new Date()
export const oldest_date = new Date("2021-01-01")
export const owner_email  = "wibble@wobble.com"
export const email_to_share = "'hello@waffle.com'"
export const another_email_to_share = "'byebye@waffle.com'"

export const add_task_list_response = {
    id: task_list_id,
    name: task_list_name,
    tasks: [],
    last_selected_time: oldest_date.toISOString(),
    owner_email: owner_email,
    shared_with: [email_to_share]
}

export const add_task_list_response_with_tasks = {
    ...add_task_list_response,
    tasks: [{
        id: task_id,
        content: "Task content",
        is_carried: false,
        is_removed: false,
        page_count: 0,
        is_ticked: false
    }]
}

export const another_add_task_list_response = {
    id: another_task_list_id,
    name: another_task_list_name,
    tasks: [] as apiTask[],
    last_selected_time: newest_date.toISOString(),
    owner_email: owner_email,
    shared_with: [email_to_share]
}

export const anotherTestTaskText = "Goodbye, world!";

export const another_add_task_list_response_with_tasks = {
    ...another_add_task_list_response,
    tasks: [{
        id: task_id,
        content: anotherTestTaskText,
        is_carried: false,
        is_removed: false,
        page_count: 0,
        is_ticked: false
    }]
}