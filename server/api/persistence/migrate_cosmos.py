from api.domain.tasks_list import TasksList
from api.persistence.converters import convert_to_domain_list
from api.persistence.initialise_cosmos import tasks_lists_container


def migrate(the_tasks_list):
    print(f"Tasks list {the_tasks_list.id} migrated")


tasks_lists = convert_to_domain_list(TasksList, tasks_lists_container.read_all_items())
for tasks_list in tasks_lists:
    migrate(tasks_list)
