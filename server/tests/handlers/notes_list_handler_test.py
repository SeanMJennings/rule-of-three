from tests.handlers.notes_list_handler_steps import *
from tests.specification import *


def test_can_add_notes_list():
    Given(a_notes_list_name)
    When(adding_a_notes_list)
    Then(the_notes_list_is_added)
