import pytest_mock
from flask.testing import FlaskClient

from tests.auth_zero_tokens import (
    get_jwks as mock_get_jwks,
    get_jwks_with_wrong_key_id,
    rs256_token,
    valid_payload,
)

test_mocker = None
headers = {"Authorization": "Bearer " + rs256_token(valid_payload())}


def the_headers():
    return headers


def an_app_with_a(the_mocker: pytest_mock.MockerFixture):
    global test_mocker
    test_mocker = the_mocker
    get_jwks_mock = test_mocker.patch("src.handlers.auth_zero_decorators.get_jwks")
    get_jwks_mock.return_value = mock_get_jwks()


def an_app_with_an_incorrect_jwks_and_a(the_mocker: pytest_mock.MockerFixture):
    global test_mocker
    test_mocker = the_mocker
    get_jwks_mock = test_mocker.patch("src.handlers.auth_zero_decorators.get_jwks")
    get_jwks_mock.return_value = get_jwks_with_wrong_key_id()
