def tasks_url():
    return "http://localhost:5000/api/tasks-lists"


def tasks_list_url_with_id(id):
    return f"{tasks_url()}/{id}"


def task_url(tasks_list_id):
    return f"{tasks_list_url_with_id(tasks_list_id)}/task"


def task_url_with_id(tasks_list_id, task_id):
    return f"{tasks_list_url_with_id(tasks_list_id)}/task/{task_id}"


def tick_task_url(tasks_list_id, task_id):
    return f"{task_url_with_id(tasks_list_id, task_id)}/tick"


def carry_task_url(tasks_list_id, task_id):
    return f"{task_url_with_id(tasks_list_id, task_id)}/carry"
