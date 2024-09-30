from tests.specification import *
from tests.application.tasks_list_steps import *


def test_create_empty_tasks_list():
    Given(a_tasks_list_name)
    When(creating_a_tasks_list)
    Then(the_tasks_list_can_be_retrieved)


def test_rename_tasks_list():
    Given(an_existing_tasks_list)
    When(renaming_a_tasks_list)
    Then(the_tasks_list_is_renamed)


def test_cannot_add_tasks_list_with_existing_name():
    Given(an_existing_tasks_list)
    When(validating(adding_a_tasks_list_with_existing_name))
    Then(informs("Tasks list with name already exists"))


def test_cannot_rename_tasks_list_to_existing_name():
    Given(an_existing_tasks_list)
    And(another_existing_tasks_list)
    When(validating(renaming_a_tasks_list_to_existing_name))
    Then(informs("Tasks list with name already exists"))


def test_delete_tasks_list():
    Given(an_existing_tasks_list)
    When(deleting_a_tasks_list)
    Then(the_tasks_list_is_deleted)


def test_add_a_task_to_tasks_list():
    Given(an_existing_tasks_list)
    When(adding_a_task)
    Then(the_task_is_added_to_the_tasks_list)


def test_tick_a_task_from_tasks_list():
    Given(an_existing_tasks_list_with_a_task)
    When(ticking_a_task)
    Then(the_task_is_ticked_in_the_tasks_list)


def test_remove_a_task_from_tasks_list():
    Given(an_existing_tasks_list_which_is_full)
    When(removing_a_task)
    Then(the_task_is_removed_from_the_tasks_list)


def test_carry_a_task_from_tasks_list():
    Given(an_existing_tasks_list_which_is_full)
    When(carrying_a_task)
    Then(the_task_is_carried_in_the_tasks_list)
