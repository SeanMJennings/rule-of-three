import base64

from tests.datetime import NewDateTimeNow, the_updated_datetime
import datetime
import pytest
from api.application.tasks_list_service import TasksListService
from tests.database import setup_db, get_db_connection, clear_db

db = None
tasks_list_service = None
tasks_list = None
tasks_lists = None
another_tasks_list = None
tasks_list_id = None
owner_email = "wibble@wobble.com"
another_owner_email = "wabble@wubble.com"


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


def an_owner_email():
    return owner_email


def another_tasks_list_name():
    return "Another Tasks List"


def creating_a_tasks_list():
    global tasks_list
    datetime.datetime = NewDateTimeNow
    tasks_list = tasks_list_service.add(a_tasks_list_name(), owner_email)


def getting_all_tasks_lists():
    global tasks_lists
    tasks_lists = tasks_list_service.get_all(owner_email)


def getting_all_tasks_lists_for_another_owner():
    global tasks_lists
    tasks_lists = tasks_list_service.get_all(another_owner_email)


def creating_another_tasks_list():
    tasks_list_service.add(another_tasks_list_name(), owner_email)


def creating_another_tasks_list_for_another_owner():
    tasks_list_service.add(another_tasks_list_name(), another_owner_email)


def an_invalid_tasks_list_id():
    global tasks_list_id
    tasks_list_id = "invalid"


def renaming_a_tasks_list():
    tasks_list_service.update(tasks_list.id, owner_email, "My Renamed Tasks List")


def renaming_a_tasks_list_to_existing_name():
    tasks_list_service.update(tasks_list_id, owner_email, another_tasks_list_name())


def renaming_a_tasks_list_to_same_name():
    tasks_list_service.update(tasks_list.id, owner_email, a_tasks_list_name())


def updating_last_selected_time():
    datetime.datetime = NewDateTimeNow
    tasks_list_service.update_last_selected_time(tasks_list.id, owner_email)


def deleting_a_tasks_list():
    tasks_list_service.delete(tasks_list.id, owner_email)


def an_existing_tasks_list():
    creating_a_tasks_list()
    global tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)


def a_shared_tasks_list():
    an_existing_tasks_list()
    sharing_tasks_list()


def a_sharer_adding_a_task():
    tasks_list_service.add_task(tasks_list.id, another_owner_email, "My Task")


def another_shared_tasks_list():
    creating_another_tasks_list_for_another_owner()
    sharing_another_tasks_list()


def a_sharer_renaming_a_tasks_list():
    tasks_list_service.update(
        tasks_list_id, another_owner_email, "My Renamed Tasks List"
    )


def a_sharer_deleting_a_tasks_list():
    tasks_list_service.delete(tasks_list_id, another_owner_email)


def adding_a_tasks_list_with_existing_name():
    creating_a_tasks_list()


def another_existing_tasks_list():
    creating_another_tasks_list()
    global another_tasks_list
    another_tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)


def adding_a_task():
    tasks_list_service.add_task(tasks_list.id, owner_email, "My Task")


def adding_a_task_for_non_existing_tasks_list():
    tasks_list_service.add_task("non_existing", owner_email, "My Task")


def an_existing_tasks_list_with_a_task():
    global tasks_list
    an_existing_tasks_list()
    adding_a_task()
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)


def an_existing_tasks_list_which_is_full():
    global tasks_list
    an_existing_tasks_list()
    for i in range(22):
        tasks_list_service.add_task(tasks_list.id, owner_email, f"My Task {i}")
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)


def ticking_a_task():
    tasks_list_service.tick_task(tasks_list.id, owner_email, tasks_list.tasks[0].id)


def ticking_a_task_for_non_existing_tasks_list():
    tasks_list_service.tick_task("non_existing", owner_email, "non_existing")


def removing_a_task():
    tasks_list_service.remove_task(tasks_list.id, owner_email, tasks_list.tasks[0].id)


def removing_a_task_from_non_existing_tasks_list():
    tasks_list_service.remove_task("non_existing", owner_email, "non_existing")


def carrying_a_task():
    tasks_list_service.carry_task(tasks_list.id, owner_email, tasks_list.tasks[0].id)


def sharing_tasks_list():
    tasks_list_service.share(tasks_list.id, owner_email, another_owner_email)


def sharing_another_tasks_list():
    global another_tasks_list
    another_tasks_list = tasks_list_service.get(
        another_tasks_list_name(), another_owner_email
    )
    tasks_list_service.share(another_tasks_list.id, another_owner_email, owner_email)


def unsharing_tasks_list():
    tasks_list_service.unshare(tasks_list.id, owner_email, another_owner_email)


def unsharing_self():
    tasks_list_service.unshare_self(tasks_list.id, another_owner_email)


def carrying_a_task_for_non_existing_tasks_list():
    tasks_list_service.carry_task("non_existing", owner_email, "non_existing")


def the_tasks_list_can_be_retrieved():
    the_tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)
    assert the_tasks_list.id == tasks_list.id
    assert the_tasks_list.owner_email == owner_email
    assert the_tasks_list.name == "My Tasks List"


def all_tasks_lists_are_retrieved():
    assert len(tasks_lists) == 2
    assert tasks_lists[0].name == "My Tasks List"
    assert tasks_lists[1].name == "Another Tasks List"


def the_last_selected_time_is_updated():
    global tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)
    assert tasks_list.last_selected_time.date() == the_updated_datetime.date()
    assert tasks_list.last_selected_time.time() == the_updated_datetime.time()


def there_are_no_tasks_lists():
    assert len(tasks_lists) == 0


def the_tasks_list_is_renamed():
    global tasks_list
    tasks_list = tasks_list_service.get("My Renamed Tasks List", owner_email)
    assert tasks_list.name == "My Renamed Tasks List"


def the_tasks_list_is_renamed_to_same_name():
    global tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)
    assert tasks_list.name == a_tasks_list_name()


def the_tasks_list_is_deleted():
    assert tasks_list_service.get(a_tasks_list_name(), owner_email) is None


def the_task_is_added_to_the_tasks_list():
    global tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)
    assert len(tasks_list.tasks) == 1
    assert tasks_list.tasks[0].content == "My Task"


def the_task_is_stored_in_base64_ascii():
    item = list(db.read_all_items())[0]
    item_content = item["tasks"][0]["content"]
    assert item_content == base64.b64encode("My Task".encode("ascii")).decode("ascii")


def the_task_is_ticked_in_the_tasks_list():
    global tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)
    assert len(tasks_list.tasks) == 1
    assert tasks_list.tasks[0].is_ticked is True


def the_task_is_removed_from_the_tasks_list():
    global tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)
    assert len(tasks_list.tasks) == 22
    assert tasks_list.tasks[0].is_removed is True


def the_task_is_carried_in_the_tasks_list():
    global tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)
    assert len(tasks_list.tasks) == 22
    assert tasks_list.tasks[0].is_carried is True


def the_tasks_list_is_shared():
    global tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)
    assert len(tasks_list.shared_with) == 1
    assert tasks_list.shared_with == [another_owner_email]


def the_tasks_list_is_unshared():
    global tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)
    assert len(tasks_list.shared_with) == 0
    assert tasks_list.shared_with == []


def the_sharer_is_unshared():
    global tasks_list
    tasks_list = tasks_list_service.get(a_tasks_list_name(), owner_email)
    assert len(tasks_list.shared_with) == 0
    assert tasks_list.shared_with == []


def the_sharer_can_see_their_list_and_a_shared_list():
    the_tasks_list = tasks_list_service.get_all(owner_email)
    assert len(the_tasks_list) == 2
    assert the_tasks_list[0].name == "My Tasks List"
    assert the_tasks_list[1].name == "Another Tasks List"
