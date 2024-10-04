from tests.handlers.error_handlers_steps import *
from tests.specification import *


def test_can_catch_validation_error():
    Given(a_validation_error)
    When(catching_the_error)
    Then(the_validation_error_is_handled)


def test_can_catch_error():
    Given(an_error)
    When(catching_the_error)
    Then(the_error_is_handled)
