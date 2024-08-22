from tests.specification import *
from tests.application.notes_list_steps import *


def test_create_empty_notes_list():
    Given(a_notes_list_name)
    When(creating_a_notes_list)
    Then(the_notes_list_can_be_retrieved)


def test_add_a_note_to_notes_list():
    Given(an_existing_notes_list)
    When(adding_a_note)
    Then(the_note_is_added_to_the_notes_list)


def test_tick_a_note_from_notes_list():
    Given(an_existing_notes_list_with_a_note)
    When(ticking_a_note)
    Then(the_note_is_ticked_in_the_notes_list)
