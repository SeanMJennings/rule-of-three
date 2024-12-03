def nonsense_url():
    return "http://localhost:5000/api/nonsense"


def tasks_url():
    return "http://localhost:5000/api/tasks-lists"


def keep_alive_url():
    return "http://localhost:5000/api/keep-alive"


def tasks_list_url_with_id(id):
    return f"{tasks_url()}/{id}"


def tasks_list_url_last_selected_time(id):
    return f"{tasks_list_url_with_id(id)}/last-selected-time"


def tasks_list_url_share(id):
    return f"{tasks_list_url_with_id(id)}/share"


def tasks_list_url_unshare(id):
    return f"{tasks_list_url_with_id(id)}/unshare"


def tasks_list_url_unshare_self(id):
    return f"{tasks_list_url_with_id(id)}/unshare-self"


def task_url(tasks_list_id):
    return f"{tasks_list_url_with_id(tasks_list_id)}/task"


def task_url_with_id(tasks_list_id, task_id):
    return f"{tasks_list_url_with_id(tasks_list_id)}/task/{task_id}"


def tick_task_url(tasks_list_id, task_id):
    return f"{task_url_with_id(tasks_list_id, task_id)}/tick"


def carry_task_url(tasks_list_id, task_id):
    return f"{task_url_with_id(tasks_list_id, task_id)}/carry"


def remove_task_url(tasks_list_id, task_id):
    return f"{task_url_with_id(tasks_list_id, task_id)}/remove"
