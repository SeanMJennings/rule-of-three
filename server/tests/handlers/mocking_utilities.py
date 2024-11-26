import pytest_mock

from api.handlers.requests import CUSTOM_AUTHORIZATION_HEADER_KEY
from tests.auth_zero_tokens import (
    get_jwks as mock_get_jwks,
    get_jwks_with_wrong_key_id,
    rs256_token,
    valid_payload,
)

test_mocker = None
get_jwks_mock = None
headers = {CUSTOM_AUTHORIZATION_HEADER_KEY: "Bearer " + rs256_token(valid_payload())}


def reset_mocks():
    global test_mocker, get_jwks_mock, headers
    test_mocker = None
    get_jwks_mock = None
    headers = {
        CUSTOM_AUTHORIZATION_HEADER_KEY: "Bearer " + rs256_token(valid_payload())
    }


def the_headers():
    return headers


def an_app_with_a(the_mocker: pytest_mock.MockerFixture):
    global test_mocker, get_jwks_mock
    test_mocker = the_mocker
    get_jwks_mock = test_mocker.patch("api.handlers.auth_zero_decorators.get_jwks")
    get_jwks_mock.return_value = mock_get_jwks()


def an_app_with_an_incorrect_jwks_and_a(the_mocker: pytest_mock.MockerFixture):
    global test_mocker, get_jwks_mock
    test_mocker = the_mocker
    get_jwks_mock = test_mocker.patch("api.handlers.auth_zero_decorators.get_jwks")
    get_jwks_mock.return_value = get_jwks_with_wrong_key_id()


def caches_well_known_jwks():
    get_jwks_mock.assert_called_once()
