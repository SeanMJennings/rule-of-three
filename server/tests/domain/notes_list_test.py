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
