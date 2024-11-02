import pytest
from azure.cosmos import ContainerProxy
from src.application.tasks_list_service import TasksListService
from src.domain.tasks_list import TasksList
from tests.database import setup_db, get_db_connection, clear_db

db: ContainerProxy
tasks_list_service: TasksListService
tasks_list: TasksList
tasks_lists: list[TasksList]
another_tasks_list: TasksList
tasks_list_id: str
owner_id = "12345"
another_owner_id = "54321"


@pytest.fixture(autouse=True)
def setup_and_teardown():
    global db, tasks_list_service
    setup_db()
    db = get_db_connection()
    tasks_list_service = TasksListService(db)
    yield
    clear_db()


def a_tasks_list_name():
    return "My Tasks List"


def an_owner_id():
    return owner_id


def another_tasks_list_name():
    return "Another Tasks List"


def creating_a_tasks_list():
    global tasks_list_service, tasks_list_id
    tasks_list_id = tasks_list_service.add(a_tasks_list_name(), owner_id)


def getting_all_tasks_lists():
    global tasks_list_service, tasks_lists
    tasks_lists = tasks_list_service.get_all(owner_id)


def getting_all_tasks_lists_for_another_owner():
    global tasks_list_service, tasks_lists
    tasks_lists = tasks_list_service.get_all(another_owner_id)


def creating_another_tasks_list():
    global tasks_list_service
    tasks_list_service.add(another_tasks_list_name(), owner_id)


def an_invalid_tasks_list_id():
    global tasks_list_id
    tasks_list_id = "invalid"


def renaming_a_tasks_list():
    global tasks_list_service
    tasks_list_service.update(tasks_list_id, owner_id, "My Renamed Tasks List")


def renaming_a_tasks_list_to_existing_name():
    global tasks_list_service
    tasks_list_service.update(tasks_list_id, owner_id, another_tasks_list_name())


def deleting_a_tasks_list():
    global tasks_list_service
    tasks_list_service.delete(tasks_list_id, owner_id)


def an_existing_tasks_list():
    creating_a_tasks_list()
    global tasks_list_service, tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_id)


def adding_a_tasks_list_with_existing_name():
    creating_a_tasks_list()


def another_existing_tasks_list():
    creating_another_tasks_list()
    global tasks_list_service, another_tasks_list
    another_tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_id)


def adding_a_task():
    global tasks_list_service, tasks_list
    tasks_list_service.add_task(tasks_list.id, owner_id, "My Task")


def adding_a_task_for_non_existing_tasks_list():
    global tasks_list_service
    tasks_list_service.add_task("non_existing", owner_id, "My Task")


def an_existing_tasks_list_with_a_task():
    global tasks_list_service, tasks_list
    an_existing_tasks_list()
    adding_a_task()
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_id)


def an_existing_tasks_list_which_is_full():
    global tasks_list_service, tasks_list
    an_existing_tasks_list()
    for i in range(22):
        tasks_list_service.add_task(tasks_list.id, owner_id, f"My Task {i}")
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_id)


def ticking_a_task():
    global tasks_list_service, tasks_list
    tasks_list_service.tick_task(tasks_list.id, owner_id, tasks_list.tasks[0].id)


def ticking_a_task_for_non_existing_tasks_list():
    global tasks_list_service
    tasks_list_service.tick_task("non_existing", owner_id, "non_existing")


def removing_a_task():
    global tasks_list_service, tasks_list
    tasks_list_service.remove_task(tasks_list.id, owner_id, tasks_list.tasks[0].id)


def removing_a_task_from_non_existing_tasks_list():
    global tasks_list_service
    tasks_list_service.remove_task("non_existing", owner_id, "non_existing")


def carrying_a_task():
    global tasks_list_service, tasks_list
    tasks_list_service.carry_task(tasks_list.id, owner_id, tasks_list.tasks[0].id)


def carrying_a_task_for_non_existing_tasks_list():
    global tasks_list_service
    tasks_list_service.carry_task("non_existing", owner_id, "non_existing")


def the_tasks_list_can_be_retrieved():
    global tasks_list_service, tasks_list, tasks_list_id
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_id)
    assert tasks_list.id == tasks_list_id
    assert tasks_list.owner_id == owner_id
    assert tasks_list.name == "My Tasks List"


def all_tasks_lists_are_retrieved():
    global tasks_list_service, tasks_lists
    assert len(tasks_lists) == 2
    assert tasks_lists[0].name == "My Tasks List"
    assert tasks_lists[1].name == "Another Tasks List"


def there_are_no_tasks_lists():
    global tasks_list_service, tasks_lists
    assert len(tasks_lists) == 0


def the_tasks_list_is_renamed():
    global tasks_list_service, tasks_list
    tasks_list = tasks_list_service.get("My Renamed Tasks List", owner_id)
    assert tasks_list.name == "My Renamed Tasks List"


def the_tasks_list_is_deleted():
    global tasks_list_service
    assert tasks_list_service.get(a_tasks_list_name(), owner_id) is None


def the_task_is_added_to_the_tasks_list():
    global tasks_list_service, tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_id)
    assert len(tasks_list.tasks) == 1
    assert tasks_list.tasks[0].content == "My Task"


def the_task_is_ticked_in_the_tasks_list():
    global tasks_list_service, tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_id)
    assert len(tasks_list.tasks) == 1
    assert tasks_list.tasks[0].is_ticked is True


def the_task_is_removed_from_the_tasks_list():
    global tasks_list_service, tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_id)
    assert len(tasks_list.tasks) == 22
    assert tasks_list.tasks[0].is_removed is True


def the_task_is_carried_in_the_tasks_list():
    global tasks_list_service, tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_id)
    assert len(tasks_list.tasks) == 22
    assert tasks_list.tasks[0].is_carried is True
