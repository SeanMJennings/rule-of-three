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


def test_requires_valid_token(mocker):
    Given(an_app_with_a(mocker))
    And(a_request_with_invalid_token)
    And(an_api_that_requires_authorisation)
    When(making_the_request)
    Then(requires_rs_256_signed_jwt)


def test_does_not_allow_hs_256_signed_jwt(mocker):
    Given(an_app_with_a(mocker))
    And(a_request_with_an_hs_256_signed_token)
    And(an_api_that_requires_authorisation)
    When(making_the_request)
    Then(requires_rs_256_signed_jwt)


def test_does_not_allow_expired_token(mocker):
    Given(an_app_with_a(mocker))
    And(a_request_with_an_expired_token)
    And(an_api_that_requires_authorisation)
    When(making_the_request)
    Then(requires_an_unexpired_token)


def test_checks_audience(mocker):
    Given(an_app_with_a(mocker))
    And(a_request_with_an_incorrect_audience)
    And(an_api_that_requires_authorisation)
    When(making_the_request)
    Then(requires_correct_issuer)


def test_requires_correct_jwks_key_id(mocker):
    Given(an_app_with_an_incorrect_jwks_and_a(mocker))
    And(a_valid_request)
    And(an_api_that_requires_authorisation)
    When(making_the_request)
    Then(requires_correct_key_id)


def test_recognises_valid_token(mocker):
    Given(an_app_with_a(mocker))
    And(a_valid_request)
    And(an_api_that_requires_authorisation)
    When(making_the_request)
    Then(allows_valid_token)
