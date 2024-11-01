from tests.handlers.auth_zero_decorators_steps import *
from tests.specification import *


def test_requires_authorisation_header(mocker):
    Given(an_app_with_a(mocker))
    And(a_request_without_authorisation_header)
    And(an_api_that_requires_authorisation)
    When(making_the_request)
    Then(an_authorised_header_is_expected)


def test_requires_authorisation_header_to_begin_with_bearer(mocker):
    Given(an_app_with_a(mocker))
    And(a_request_with_authorisation_header_missing_bearer)
    And(an_api_that_requires_authorisation)
    When(making_the_request)
    Then(authorised_header_must_start_with_bearer)


def test_requires_authorisation_header_to_contain_token(mocker):
    Given(an_app_with_a(mocker))
    And(a_request_with_authorisation_header_missing_token)
    And(an_api_that_requires_authorisation)
    When(making_the_request)
    Then(authorised_header_must_have_token)


def test_requires_authorisation_header_to_only_contain_bearer_and_token(mocker):
    Given(an_app_with_a(mocker))
    And(a_request_with_authorisation_header_containing_extras)
    And(an_api_that_requires_authorisation)
    When(making_the_request)
    Then(authorised_header_must_only_have_bearer_and_token)
