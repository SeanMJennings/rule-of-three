def tasks_url():
    return "http://localhost:5000/api/tasks_lists"


def tasks_url_with_id(id):
    return f"{tasks_url()}/{id}"
