from src.domain.tasks_list import TasksList
from tests.validations import validate_uuid4
from tests.datetime import (
    OldDateTimeNow,
    NewDateTimeNow,
    the_datetime,
    the_updated_datetime,
)
import datetime

tasks_list: TasksList = TasksList(name="My Tasks List", owner_id="12345")


def a_tasks_list_name():
    return "My Tasks List"


def an_owner_id():
    return "12345"


def creating_a_tasks_list():
    global tasks_list
    datetime.datetime = OldDateTimeNow
    tasks_list = TasksList(a_tasks_list_name(), an_owner_id())


def updating_last_selected_time():
    global tasks_list
    datetime.datetime = NewDateTimeNow
    tasks_list.update_last_selected_time()


def a_tasks_list():
    global tasks_list
    tasks_list = TasksList("My Tasks List", an_owner_id())


def a_tasks_list_with_22_tasks():
    global tasks_list
    tasks_list = TasksList("My Tasks List", an_owner_id())
    for _ in range(22):
        tasks_list.add("wibble")


def a_tasks_list_with_20_tasks():
    global tasks_list
    tasks_list = TasksList("My Tasks List", an_owner_id())
    for _ in range(20):
        tasks_list.add("wibble")


def adding_a_task_to_tasks_list(task_text):
    global tasks_list
    tasks_list.add(task_text)


def ticking_a_task():
    global tasks_list
    if len(tasks_list.tasks) == 0:
        tasks_list.tick("wibble")
    else:
        tasks_list.tick(tasks_list.tasks[0].id)


def ticking_the_first_task():
    global tasks_list
    tasks_list.tick(tasks_list.tasks[0].id)


def adding_two_tasks():
    global tasks_list
    tasks_list.add("wibble")
    tasks_list.add("wobble")


def carrying_the_first_task():
    global tasks_list
    tasks_list.carry(tasks_list.tasks[0].id)


def removing_the_first_task():
    global tasks_list
    tasks_list.remove(tasks_list.tasks[0].id)


def carrying_all_tasks_except_the_ticked_one():
    for task in tasks_list.tasks[1:]:
        tasks_list.carry(task.id)


def the_task_is_ticked():
    assert tasks_list.tasks[0].is_ticked is True


def the_tasks_list_is_empty():
    assert tasks_list.name == a_tasks_list_name()
    assert tasks_list.owner_id == an_owner_id()
    assert len(tasks_list.tasks) == 0


def the_last_selected_time_is_now():
    assert tasks_list.last_selected_time.date() == the_datetime.date()
    assert tasks_list.last_selected_time.time() == the_datetime.time()


def the_last_selected_time_is_updated():
    assert tasks_list.last_selected_time.date() == the_updated_datetime.date()
    assert tasks_list.last_selected_time.time() == the_updated_datetime.time()


def the_tasks_list_contains_a_task_with_text(task_text):
    assert len(tasks_list.tasks) == 1
    assert tasks_list.tasks[0].content == task_text
    assert validate_uuid4(tasks_list.tasks[0].id) is True


def the_first_task_is_carried():
    assert tasks_list.tasks[0].is_carried is True


def the_first_task_is_marked_for_removal():
    assert tasks_list.tasks[0].is_removed is True


def carrying_the_first_eleven_tasks():
    for task in tasks_list.tasks[:11]:
        tasks_list.carry(task.id)


def removing_the_next_eleven_tasks():
    for task in tasks_list.tasks[11:]:
        tasks_list.remove(task.id)


def removing_the_next_ten_tasks():
    for task in tasks_list.tasks[11:21]:
        tasks_list.remove(task.id)


def ticking_the_last_task():
    tasks_list.tick(tasks_list.tasks[-1].id)


def tasks_have_been_carried_twice():
    global tasks_list
    for task in tasks_list.tasks:
        tasks_list.carry(task.id)
    for task in tasks_list.tasks:
        tasks_list.carry(task.id)


def removing_all_tasks():
    global tasks_list
    for task in tasks_list.tasks:
        tasks_list.remove(task.id)


def the_first_eleven_tasks_are_carried():
    for task in tasks_list.tasks[:11]:
        assert task.page_count == 1


def the_first_eleven_tasks_have_a_page_count_of_1():
    for task in tasks_list.tasks[:11]:
        assert task.page_count == 1


def the_next_eleven_tasks_are_removed():
    assert len(tasks_list.tasks) == 11


def the_ticked_task_is_removed():
    assert len(tasks_list.tasks) == 21
    assert all([task.is_ticked is False for task in tasks_list.tasks])
