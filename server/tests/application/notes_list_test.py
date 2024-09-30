from tests.specification import *
from tests.application.notes_list_steps import *


def test_create_empty_notes_list():
    Given(a_notes_list_name)
    When(creating_a_notes_list)
    Then(the_notes_list_can_be_retrieved)


def test_rename_notes_list():
    Given(an_existing_notes_list)
    When(renaming_a_notes_list)
    Then(the_notes_list_is_renamed)


def test_cannot_add_notes_list_with_existing_name():
    Given(an_existing_notes_list)
    When(validating(adding_a_notes_list_with_existing_name))
    Then(informs("Notes list with name already exists"))


def test_cannot_rename_notes_list_to_existing_name():
    Given(an_existing_notes_list)
    And(another_existing_notes_list)
    When(validating(renaming_a_notes_list_to_existing_name))
    Then(informs("Notes list with name already exists"))


def test_delete_notes_list():
    Given(an_existing_notes_list)
    When(deleting_a_notes_list)
    Then(the_notes_list_is_deleted)


def test_add_a_note_to_notes_list():
    Given(an_existing_notes_list)
    When(adding_a_note)
    Then(the_note_is_added_to_the_notes_list)


def test_tick_a_note_from_notes_list():
    Given(an_existing_notes_list_with_a_note)
    When(ticking_a_note)
    Then(the_note_is_ticked_in_the_notes_list)


def test_remove_a_note_from_notes_list():
    Given(an_existing_notes_list_which_is_full)
    When(removing_a_note)
    Then(the_note_is_removed_from_the_notes_list)


def test_carry_a_note_from_notes_list():
    Given(an_existing_notes_list_which_is_full)
    When(carrying_a_note)
    Then(the_note_is_carried_in_the_notes_list)
