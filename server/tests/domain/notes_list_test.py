from tests.specification import *
from tests.domain.notes_list_steps import *


def test_create_empty_notes_list():
    Given(a_notes_list_name)
    When(creating_a_notes_list)
    Then(the_notes_list_is_empty)


def test_can_add_note_to_notes_list():
    Given(a_notes_list_name)
    And(creating_a_notes_list)
    When(adding_a_note_to_notes_list("My Note"))
    Then(the_notes_list_contains_a_note_with_text("My Note"))


def test_can_tick_a_note():
    Given(a_notes_list)
    And(adding_a_note_to_notes_list("My Note"))
    When(ticking_a_note)
    Then(the_note_is_ticked)


def test_cannot_tick_a_note_that_does_not_exist():
    Given(a_notes_list)
    When(validating(ticking_a_note))
    Then(informs("Note not found"))


def test_have_to_decide_to_carry_or_remove_each_note_once_list_is_full():
    Given(a_notes_list_with_22_notes)
    When(validating(adding_a_note_to_notes_list, "My Note"))
    Then(informs("Notes list holds 22 notes. Each note must be carried or removed"))


def test_cannot_carry_a_note_until_list_is_full():
    Given(a_notes_list_with_20_notes)
    When(validating(carrying_the_first_note))
    Then(informs("Notes list is not yet full"))


def test_cannot_remove_a_note_until_list_is_full():
    Given(a_notes_list_with_20_notes)
    When(validating(removing_the_first_note))
    Then(informs("Notes list is not yet full"))


def test_can_carry_note_once_list_is_full():
    Given(a_notes_list_with_22_notes)
    When(carrying_the_first_note)
    Then(the_first_note_is_carried)


def test_can_remove_a_note_once_list_is_full():
    Given(a_notes_list_with_22_notes)
    When(removing_the_first_note)
    Then(the_first_note_is_marked_for_removal)


def test_can_carry_some_notes_and_remove_others():
    Given(a_notes_list_with_22_notes)
    When(carrying_the_first_eleven_notes)
    And(removing_the_next_eleven_notes)
    Then(the_first_eleven_notes_are_carried)
    And(the_first_eleven_notes_have_a_page_count_of_1)
    And(the_next_eleven_notes_are_removed)


def test_ticked_notes_cannot_be_marked_for_carrying():
    Given(a_notes_list_with_20_notes)
    And(ticking_the_first_note)
    And(adding_two_notes)
    When(validating(carrying_the_first_note))
    Then(informs("Ticked notes cannot be carried"))


def test_ticked_notes_cannot_be_marked_for_removal():
    Given(a_notes_list_with_20_notes)
    And(ticking_the_first_note)
    And(adding_two_notes)
    When(validating(removing_the_first_note))
    Then(informs("Ticked notes cannot be marked for removal"))


def test_ticked_notes_are_removed_when_a_list_is_carried():
    Given(a_notes_list_with_20_notes)
    And(ticking_the_first_note)
    And(adding_two_notes)
    When(carrying_all_notes_except_the_ticked_one)
    Then(the_ticked_note_is_removed)


def test_cannot_add_note_until_finished_carrying_or_removing_notes():
    Given(a_notes_list_with_22_notes)
    When(carrying_the_first_eleven_notes)
    When(validating(adding_a_note_to_notes_list, "My Note"))
    Then(informs("Notes list holds 22 notes. Each note must be carried or removed"))


def test_can_only_carry_notes_twice():
    Given(a_notes_list_with_22_notes)
    And(notes_have_been_carried_twice)
    When(validating(carrying_the_first_note))
    Then(informs("Note has been carried twice and must be removed"))


def test_must_remove_note_that_has_been_carried_twice():
    Given(a_notes_list_with_22_notes)
    And(notes_have_been_carried_twice)
    When(removing_all_notes)
    Then(the_notes_list_is_empty)
