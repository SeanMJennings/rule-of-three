import pytest
from flask import Flask
from flask.testing import FlaskClient
from flask.views import MethodView
from flask_cors import CORS

from api.cache import cache, cache_config
from api.handlers.auth_zero_decorators import requires_auth
from api.handlers.exception_handlers import handle_exception
from api.handlers.requests import CUSTOM_AUTHORIZATION_HEADER_KEY
from api.handlers.responses import *
from tests.auth_zero_tokens import (
    valid_payload,
    expired_payload,
    hs256_token,
    rs256_token,
    different_issuer_payload,
)
from tests.handlers.mocking_utilities import reset_mocks
from tests.handlers.routing import nonsense_url

response = None
client: FlaskClient = None
headers = None


@pytest.fixture(autouse=True)
def setup_and_teardown():
    global client
    an_app()
    reset_mocks()
    cache.clear()
    yield
    client.__exit__(None, None, None)


def an_app():
    global client
    app = Flask(__name__)
    cache.init_app(app, config=cache_config)
    CORS(app)
    app.add_url_rule(
        "/api" + NonsenseHandler.route(),
        view_func=NonsenseHandler.as_view(NonsenseHandler.name()),
    )
    app.errorhandler(Exception)(handle_exception)
    client = app.test_client()


def a_request_without_authorisation_header():
    global headers
    headers = None


def a_request_with_authorisation_header_missing_bearer():
    global headers
    headers = {CUSTOM_AUTHORIZATION_HEADER_KEY: "token"}


def a_request_with_authorisation_header_missing_token():
    global headers
    headers = {CUSTOM_AUTHORIZATION_HEADER_KEY: "Bearer"}


def a_request_with_authorisation_header_containing_extras():
    global headers
    headers = {CUSTOM_AUTHORIZATION_HEADER_KEY: "Bearer token wibble"}


def a_request_with_invalid_token():
    global headers
    headers = {CUSTOM_AUTHORIZATION_HEADER_KEY: "Bearer sillytoken"}


def a_request_with_an_hs_256_signed_token():
    global headers
    headers = {
        CUSTOM_AUTHORIZATION_HEADER_KEY: "Bearer " + hs256_token(valid_payload())
    }


def a_request_with_an_expired_token():
    global headers
    headers = {
        CUSTOM_AUTHORIZATION_HEADER_KEY: "Bearer " + rs256_token(expired_payload())
    }


def a_request_with_an_incorrect_audience():
    global headers
    headers = {
        CUSTOM_AUTHORIZATION_HEADER_KEY: "Bearer "
        + rs256_token(different_issuer_payload())
    }


def a_valid_request():
    global headers
    headers = {
        CUSTOM_AUTHORIZATION_HEADER_KEY: "Bearer " + rs256_token(valid_payload())
    }


def a_reset_cache():
    cache.clear()


def making_the_request():
    global response, client
    response = client.get(nonsense_url(), headers=headers)


def an_authorised_header_is_expected():
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert (
        json.loads(response.data)["error"]
        == CUSTOM_AUTHORIZATION_HEADER_KEY + " header is expected"
    )


def authorised_header_must_start_with_bearer():
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert (
        json.loads(response.data)["error"]
        == CUSTOM_AUTHORIZATION_HEADER_KEY + " header must start with: Bearer"
    )


def authorised_header_must_have_token():
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert json.loads(response.data)["error"] == "Token not found"


def authorised_header_must_only_have_bearer_and_token():
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert (
        json.loads(response.data)["error"]
        == CUSTOM_AUTHORIZATION_HEADER_KEY + " header must be: Bearer token"
    )


def requires_valid_header():
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert (
        json.loads(response.data)["error"]
        == "Invalid header. Use an RS256 signed JWT Access Token"
    )


def requires_rs_256_signed_jwt():
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert (
        json.loads(response.data)["error"]
        == "HS256 is invalid header algorithm. Use an RS256 signed JWT Access Token"
    )


def requires_an_unexpired_token():
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert json.loads(response.data)["error"] == "Token is expired"


def requires_correct_issuer():
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert (
        json.loads(response.data)["error"]
        == "Incorrect claims, please check the audience and issuer"
    )


def requires_correct_key_id():
    assert response.status_code == HTTPStatus.UNAUTHORIZED
    assert json.loads(response.data)["error"] == "Unable to find appropriate key"


def allows_valid_token():
    assert response.status_code == HTTPStatus.OK


def a_tasks_list_name():
    return "My Tasks List"


class NonsenseHandler(MethodView):
    init_every_request = False
    decorators = [requires_auth]

    @staticmethod
    def route():
        return "/nonsense"

    @staticmethod
    def name():
        return "nonsense_handler"

    def get(self):
        return success_response(None)
