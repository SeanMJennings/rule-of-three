from api.application.string_encoding import encode_string, decode_string
from api.domain.tasks_list import TasksList
from api.persistence.converters import convert_to_domain_list
from api.persistence.initialise_cosmos import container


def migrate(the_tasks_list):
    try:
        decode_string(the_tasks_list.tasks[0].content)
    except Exception:
        the_tasks_list.__setattr__(
            'tasks', [task.set_content(encode_string(task.content)) for task in the_tasks_list.tasks])
        container.upsert_item(the_tasks_list.to_dict())
        print(f"Tasks list {the_tasks_list.id} migrated")


tasks_lists = convert_to_domain_list(TasksList, container.read_all_items())
for tasks_list in tasks_lists:
    migrate(tasks_list)
