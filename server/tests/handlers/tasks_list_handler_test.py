from tests.handlers.mocking_utilities import an_app_with_a
from tests.handlers.tasks_list_handler_steps import *
from tests.specification import *


def test_can_add_tasks_list(mocker):
    Given(an_app_with_a(mocker))
    And(a_tasks_list_name)
    When(adding_a_tasks_list)
    Then(the_tasks_list_is_added)


def test_can_return_empty_list_when_no_tasks_lists(mocker):
    Given(an_app_with_a(mocker))
    When(listing_tasks_lists)
    Then(the_tasks_lists_are_listed_empty)


def test_can_list_tasks_lists(mocker):
    Given(an_app_with_a(mocker))
    And(a_tasks_list)
    And(another_tasks_list)
    When(listing_tasks_lists)
    Then(the_tasks_lists_are_listed)


def test_listing_a_single_tasks_list_updates_last_selected_time(mocker):
    Given(an_app_with_a(mocker))
    And(a_tasks_list)
    When(listing_the_task_list)
    Then(the_last_selected_time_is_updated)


def test_can_update_tasks_list(mocker):
    Given(an_app_with_a(mocker))
    And(a_tasks_list)
    When(updating_the_tasks_list)
    Then(the_tasks_list_is_updated)


def test_can_delete_tasks_list(mocker):
    Given(an_app_with_a(mocker))
    And(a_tasks_list)
    When(deleting_the_tasks_list)
    Then(the_tasks_list_is_deleted)


def test_can_add_task_to_tasks_list(mocker):
    Given(an_app_with_a(mocker))
    And(a_tasks_list)
    When(adding_a_task_to_tasks_list)
    Then(the_task_is_added_to_the_tasks_list)


def test_can_tick_task_in_tasks_list(mocker):
    Given(an_app_with_a(mocker))
    And(a_tasks_list_with_tasks)
    When(ticking_a_task_in_tasks_list)
    Then(the_task_is_ticked_in_the_tasks_list)


def test_can_remove_task_from_tasks_list(mocker):
    Given(an_app_with_a(mocker))
    And(a_tasks_list_full_of_tasks)
    When(removing_a_task_from_tasks_list)
    Then(the_task_is_removed_from_the_tasks_list)


def test_can_carry_task_in_tasks_list(mocker):
    Given(an_app_with_a(mocker))
    And(a_tasks_list_full_of_tasks)
    When(carrying_a_task_in_tasks_list)
    Then(the_task_is_carried_in_the_tasks_list)
