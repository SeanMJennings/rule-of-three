import pytest
import pytest_mock
from flask import Flask
from flask.views import MethodView
from flask_cors import CORS
from flask.testing import FlaskClient

from src.handlers.auth_zero_decorators import requires_auth
from src.handlers.exception_handlers import handle_exception
from src.handlers.responses import *
from tests.auth_zero_tokens import get_jwks as mock_get_jwks
from tests.handlers.routing import nonsense_url

response = None
client: FlaskClient = None
test_mocker = None
headers = None


@pytest.fixture(autouse=True)
def setup_and_teardown():
    global client
    client = an_app().test_client()
    yield
    client.__exit__(None, None, None)


def an_app():
    app = Flask(__name__)
    CORS(app)
    app.add_url_rule(
        "/api" + NonsenseHandler.route(),
        view_func=NonsenseHandler.as_view(NonsenseHandler.name()),
    )
    app.errorhandler(Exception)(handle_exception)
    return app


def an_app_with_a(the_mocker: pytest_mock.MockerFixture):
    global test_mocker
    test_mocker = the_mocker
    get_jwks_mock = test_mocker.patch("src.handlers.auth_zero_decorators.get_jwks")
    get_jwks_mock.return_value = mock_get_jwks()


def a_request_without_authorisation_header():
    global headers
    headers = None


def a_request_with_authorisation_header_missing_bearer():
    global headers
    headers = {"Authorization": "token"}


def a_request_with_authorisation_header_missing_token():
    global headers
    headers = {"Authorization": "Bearer"}


def a_request_with_authorisation_header_containing_extras():
    global headers
    headers = {"Authorization": "Bearer token wibble"}


def an_api_that_requires_authorisation():
    return None


def making_the_request():
    global response, client
    response = client.get(nonsense_url(), headers=headers)


def an_authorised_header_is_expected():
    assert response.status_code == http.client.UNAUTHORIZED
    assert json.loads(response.data)["error"] == "Authorization header is expected"


def authorised_header_must_start_with_bearer():
    assert response.status_code == http.client.UNAUTHORIZED
    assert (
        json.loads(response.data)["error"]
        == "Authorization header must start with: Bearer"
    )


def authorised_header_must_have_token():
    assert response.status_code == http.client.UNAUTHORIZED
    assert json.loads(response.data)["error"] == "Token not found"


def authorised_header_must_only_have_bearer_and_token():
    assert response.status_code == http.client.UNAUTHORIZED
    assert (
        json.loads(response.data)["error"]
        == "Authorization header must be: Bearer token"
    )


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
        return success_response()
