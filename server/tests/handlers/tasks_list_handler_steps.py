import pytest
import json
import http

from src.application.tasks_list_service import TasksListService
from tests.handlers.routing import tasks_url
from src.app import create_app
from tests.handlers.routing import tasks_url_with_id
from tests.database import setup_db, get_db_connection, clear_db

response = None
client = None
tasks_id = None


@pytest.fixture(autouse=True)
def setup_and_teardown():
    global client
    setup_db()
    client = create_app(TasksListService(get_db_connection())).test_client()
    yield
    client.__exit__(None, None, None)
    clear_db()


def a_tasks_list_name():
    return "My Tasks List"


def an_updated_tasks_list_name():
    return "Updated Tasks List"


def adding_a_tasks_list():
    global response, tasks_id
    response = client.post(tasks_url(), json={"name": a_tasks_list_name()})
    tasks_id = json.loads(response.data)["id"]


def a_tasks_list():
    adding_a_tasks_list()


def updating_the_tasks_list():
    global response
    response = client.patch(
        tasks_url_with_id(tasks_id),
        json={"name": an_updated_tasks_list_name()},
    )


def deleting_the_tasks_list():
    global response
    response = client.delete(tasks_url_with_id(tasks_id))


def the_tasks_list_is_added():
    global response
    assert response.status_code == http.client.CREATED
    response = client.get(tasks_url_with_id(tasks_id))
    assert response.status_code == http.client.OK
    assert json.loads(response.data)["name"] == a_tasks_list_name()


def the_tasks_list_is_updated():
    global response
    assert response.status_code == http.client.NO_CONTENT
    response = client.get(tasks_url_with_id(tasks_id))
    assert response.status_code == http.client.OK
    assert json.loads(response.data)["name"] == an_updated_tasks_list_name()


def the_tasks_list_is_deleted():
    global response
    assert response.status_code == http.client.NO_CONTENT
    response = client.get(tasks_url_with_id(tasks_id))
    assert response.status_code == http.client.NOT_FOUND
    assert json.loads(response.data)["error"] == "Tasks list not found"
