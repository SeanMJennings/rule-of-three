﻿from tests.specification import *
from tests.application.tasks_list_steps import *


def test_create_empty_tasks_list():
    Given(a_tasks_list_name)
    And(an_owner_email)
    When(creating_a_tasks_list)
    Then(the_tasks_list_can_be_retrieved)


def test_get_all_tasks_lists():
    Given(an_existing_tasks_list)
    And(another_existing_tasks_list)
    When(getting_all_tasks_lists)
    Then(all_tasks_lists_are_retrieved)


def test_non_owner_cannot_get_a_tasks_list():
    Given(an_existing_tasks_list)
    When(getting_all_tasks_lists_for_another_owner)
    Then(there_are_no_tasks_lists)


def test_return_empty_list_when_no_tasks_list():
    When(getting_all_tasks_lists)
    Then(there_are_no_tasks_lists)


def test_rename_tasks_list():
    Given(an_existing_tasks_list)
    When(renaming_a_tasks_list)
    Then(the_tasks_list_is_renamed)


def test_cannot_rename_non_existing_tasks_list():
    Given(an_invalid_tasks_list_id)
    When(validating(renaming_a_tasks_list))
    Then(informs("Tasks list not found"))


def test_cannot_add_tasks_list_with_existing_name():
    Given(an_existing_tasks_list)
    When(validating(adding_a_tasks_list_with_existing_name))
    Then(informs("Tasks list with name already exists"))


def test_cannot_rename_tasks_list_to_existing_name():
    Given(an_existing_tasks_list)
    And(another_existing_tasks_list)
    When(validating(renaming_a_tasks_list_to_existing_name))
    Then(informs("Tasks list with name already exists"))


def test_can_rename_tasks_list_to_same_name():
    Given(an_existing_tasks_list)
    When(renaming_a_tasks_list_to_same_name)
    Then(the_tasks_list_is_renamed_to_same_name)


def test_update_last_selected_time():
    Given(an_existing_tasks_list)
    When(updating_last_selected_time)
    Then(the_last_selected_time_is_updated)


def test_delete_tasks_list():
    Given(an_existing_tasks_list)
    When(deleting_a_tasks_list)
    Then(the_tasks_list_is_deleted)


def test_cannot_delete_non_existing_tasks_list():
    Given(an_invalid_tasks_list_id)
    When(validating(deleting_a_tasks_list))
    Then(informs("Tasks list not found"))


def test_add_a_task_to_tasks_list():
    Given(an_existing_tasks_list)
    When(adding_a_task)
    Then(the_task_is_added_to_the_tasks_list)


def test_tasks_stored_in_base64_ascii():
    Given(an_existing_tasks_list)
    When(adding_a_task)
    Then(the_task_is_stored_in_base64_ascii)


def test_cannot_add_task_to_non_existing_tasks_list():
    Given(an_invalid_tasks_list_id)
    When(validating(adding_a_task_for_non_existing_tasks_list))
    Then(informs("Tasks list not found"))


def test_tick_a_task_from_tasks_list():
    Given(an_existing_tasks_list_with_a_task)
    When(ticking_a_task)
    Then(the_task_is_ticked_in_the_tasks_list)


def test_cannot_tick_task_for_non_existing_tasks_list():
    Given(an_existing_tasks_list)
    When(validating(ticking_a_task_for_non_existing_tasks_list))
    Then(informs("Tasks list not found"))


def test_remove_a_task_from_tasks_list():
    Given(an_existing_tasks_list_which_is_full)
    When(removing_a_task)
    Then(the_task_is_removed_from_the_tasks_list)


def test_cannot_remove_task_for_non_existing_tasks_list():
    Given(an_existing_tasks_list)
    When(validating(removing_a_task_from_non_existing_tasks_list))
    Then(informs("Tasks list not found"))


def test_carry_a_task_from_tasks_list():
    Given(an_existing_tasks_list_which_is_full)
    When(carrying_a_task)
    Then(the_task_is_carried_in_the_tasks_list)


def test_cannot_carry_task_for_non_existing_tasks_list():
    Given(an_existing_tasks_list)
    When(validating(carrying_a_task_for_non_existing_tasks_list))
    Then(informs("Tasks list not found"))


def test_can_share_tasks_list():
    Given(an_existing_tasks_list)
    When(sharing_tasks_list)
    Then(the_tasks_list_is_shared)


def test_can_unshare_tasks_list():
    Given(a_shared_tasks_list)
    When(unsharing_tasks_list)
    Then(the_tasks_list_is_unshared)


def test_a_sharer_can_unshare_themselves():
    Given(a_shared_tasks_list)
    When(unsharing_self)
    Then(the_sharer_is_unshared)


def test_a_sharer_can_see_their_list_and_a_shared_list():
    Given(an_existing_tasks_list)
    And(another_shared_tasks_list)
    When(getting_all_tasks_lists)
    Then(the_sharer_can_see_their_list_and_a_shared_list)


def test_a_sharer_cannot_update_a_list_name():
    Given(a_shared_tasks_list)
    When(validating(a_sharer_renaming_a_tasks_list))
    Then(informs("Tasks list not found"))


def test_a_sharer_cannot_delete_a_list():
    Given(a_shared_tasks_list)
    When(validating(a_sharer_deleting_a_tasks_list))
    Then(informs("Tasks list not found"))


def test_a_sharer_can_add_a_task():
    Given(a_shared_tasks_list)
    When(a_sharer_adding_a_task)
    Then(the_task_is_added_to_the_tasks_list)
