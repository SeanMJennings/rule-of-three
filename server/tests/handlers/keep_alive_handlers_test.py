from tests.handlers.keep_alive_handlers_steps import calling_keep_alive, the_keep_alive_is_called, an_app
from tests.specification import *


def test_can_call_keep_alive():
    Given(an_app)
    When(calling_keep_alive)
    Then(the_keep_alive_is_called)
