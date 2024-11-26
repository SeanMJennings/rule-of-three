from http import HTTPStatus
from flask.testing import FlaskClient
from api import TasksListService
from api.app import create_app
from tests.handlers.routing import *

response = None
client: FlaskClient = None
tasks_list_id = None


def an_app():
    global client
    app = create_app(TasksListService(None))
    client = app.test_client()


def calling_keep_alive():
    global response
    response = client.get(keep_alive_url())


def the_keep_alive_is_called():
    assert response.status_code == HTTPStatus.OK
