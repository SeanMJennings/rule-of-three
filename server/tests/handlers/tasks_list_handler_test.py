from tests.handlers.tasks_list_handler_steps import *
from tests.specification import *


def test_can_add_tasks_list():
    Given(a_tasks_list_name)
    When(adding_a_tasks_list)
    Then(the_tasks_list_is_added)


def test_can_update_tasks_list():
    Given(a_tasks_list)
    When(updating_the_tasks_list)
    Then(the_tasks_list_is_updated)


def test_can_delete_tasks_list():
    Given(a_tasks_list)
    When(deleting_the_tasks_list)
    Then(the_tasks_list_is_deleted)
