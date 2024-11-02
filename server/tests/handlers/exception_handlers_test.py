from tests.handlers.exception_handlers_steps import *
from tests.handlers.mocking_utilities import an_app_with_a
from tests.specification import *


def test_can_catch_validation_error(mocker):
    Given(an_app_with_a(mocker))
    And(a_validation_error)
    When(catching_the_error)
    Then(the_validation_error_is_handled)


def test_can_catch_error(mocker):
    Given(an_app_with_a(mocker))
    And(an_error)
    When(catching_the_error)
    Then(the_error_is_handled)
