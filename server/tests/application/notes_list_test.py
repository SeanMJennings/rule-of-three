from tests.specification import *
from tests.application.notes_list_steps import *


@pytest.skip(allow_module_level=True)
def test_create_empty_notes_list():
    Given(a_notes_list_name)
    When(creating_a_notes_list)
    Then(the_notes_list_can_be_retrieved)
