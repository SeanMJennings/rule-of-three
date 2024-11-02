import json
from http import HTTPStatus

import pytest
from flask.testing import FlaskClient

from src.app import create_app
from src.application.validation_exception import ValidationException
from tests.handlers.mocking_utilities import the_headers
from tests.handlers.routing import tasks_url

response = None
client: FlaskClient = None
fake_task_list_service = None


@pytest.fixture(autouse=True)
def setup_and_teardown():
    global client
    yield
    client.__exit__(None, None, None)


class FakeTaskListServiceWithValidationException:
    def add(self, name: str, owner_id: str):
        raise ValidationException("wibble")


class FakeTaskListServiceWithException:
    def add(self, name: str, owner_id: str):
        raise Exception("wobble")


def a_validation_error():
    global client
    client = create_app(FakeTaskListServiceWithValidationException()).test_client()


def an_error():
    global client
    client = create_app(FakeTaskListServiceWithException()).test_client()


def catching_the_error():
    global response, client
    response = client.post(tasks_url(), json={"name": "wobble"}, headers=the_headers())


def the_validation_error_is_handled():
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    assert json.loads(response.data)["error"] == "wibble"


def the_error_is_handled():
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert json.loads(response.data)["error"] == "Internal server error"
