import json
from http import HTTPStatus
from tests.datetime import (
    NewDateTimeNow,
    the_updated_datetime,
)
import datetime
import pytest
from flask.testing import FlaskClient
from api.cache import cache, cache_config
from api.app import create_app
from api.application.tasks_list_service import TasksListService
from tests.database import setup_db, get_db_connection, clear_db
from tests.handlers.mocking_utilities import the_headers, the_headers_for_a_sharer
from tests.handlers.routing import *

response = None
client: FlaskClient = None
tasks_list_id = None
another_email = "arghhhhh@wobble.com"


@pytest.fixture(autouse=True)
def setup_and_teardown():
    global client
    setup_db()
    app = create_app(TasksListService(get_db_connection()))
    cache.init_app(app, config=cache_config)
    client = app.test_client()
    cache.clear()
    yield
    client.__exit__(None, None, None)
    clear_db()


def a_tasks_list_name():
    return "My Tasks List"


def another_tasks_list_name():
    return "Another Tasks List"


def an_updated_tasks_list_name():
    return "Updated Tasks List"


def adding_a_tasks_list():
    global response, tasks_list_id
    response = client.post(
        tasks_url(), json={"name": a_tasks_list_name()}, headers=the_headers()
    )
    tasks_list_id = json.loads(response.data)["id"]


def listing_tasks_lists():
    global response
    response = client.get(tasks_url(), headers=the_headers())


def a_tasks_list():
    adding_a_tasks_list()


def a_shared_tasks_list():
    adding_a_tasks_list()
    sharing_the_tasks_list()


def a_tasks_list_with_tasks():
    adding_a_tasks_list()
    adding_a_task_to_tasks_list()


def a_tasks_list_full_of_tasks():
    adding_a_tasks_list()
    for _ in range(22):
        adding_a_task_to_tasks_list()


def another_tasks_list():
    global response, tasks_list_id
    response = client.post(
        tasks_url(), json={"name": another_tasks_list_name()}, headers=the_headers()
    )
    tasks_list_id = json.loads(response.data)["id"]


def updating_the_tasks_list():
    global response
    response = client.patch(
        tasks_list_url_with_id(tasks_list_id),
        json={"name": an_updated_tasks_list_name()},
        headers=the_headers(),
    )


def updating_last_selected_time():
    global response
    datetime.datetime = NewDateTimeNow
    response = client.patch(
        tasks_list_url_last_selected_time(tasks_list_id),
        headers=the_headers(),
    )


def deleting_the_tasks_list():
    global response
    response = client.delete(
        tasks_list_url_with_id(tasks_list_id), headers=the_headers()
    )


def adding_a_task_to_tasks_list():
    global response
    response = client.post(
        task_url(tasks_list_id), json={"content": "A Task"}, headers=the_headers()
    )


def ticking_a_task_in_tasks_list():
    global response
    task_id = json.loads(response.data)["id"]
    response = client.patch(
        tick_task_url(tasks_list_id, task_id), headers=the_headers()
    )


def removing_a_task_from_tasks_list():
    global response
    task_id = json.loads(response.data)["id"]
    response = client.patch(
        remove_task_url(tasks_list_id, task_id), headers=the_headers()
    )


def carrying_a_task_in_tasks_list():
    global response
    task_id = json.loads(response.data)["id"]
    response = client.patch(
        carry_task_url(tasks_list_id, task_id), headers=the_headers()
    )


def sharing_the_tasks_list():
    global response
    response = client.patch(
        tasks_list_url_share(tasks_list_id),
        json={"share_with": another_email},
        headers=the_headers(),
    )


def unsharing_the_tasks_list():
    global response
    response = client.patch(
        tasks_list_url_unshare(tasks_list_id),
        json={"unshare_with": another_email},
        headers=the_headers(),
    )


def a_sharer_unsharing_themselves():
    global response
    response = client.patch(
        tasks_list_url_unshare_self(tasks_list_id),
        headers=the_headers_for_a_sharer(),
    )


def the_tasks_list_is_added():
    global response
    assert response.status_code == HTTPStatus.CREATED
    response = client.get(tasks_list_url_with_id(tasks_list_id), headers=the_headers())
    assert response.status_code == HTTPStatus.OK
    assert json.loads(response.data)["name"] == a_tasks_list_name()


def the_tasks_lists_are_listed_empty():
    global response
    assert response.status_code == HTTPStatus.OK
    response_data = json.loads(response.data)
    assert len(response_data) == 0


def the_tasks_lists_are_listed():
    global response
    assert response.status_code == HTTPStatus.OK
    response_data = json.loads(response.data)
    assert len(response_data) == 2
    assert response_data[0]["name"] == a_tasks_list_name()
    assert response_data[1]["name"] == another_tasks_list_name()


def the_tasks_list_is_updated():
    global response
    assert response.status_code == HTTPStatus.NO_CONTENT
    response = client.get(tasks_list_url_with_id(tasks_list_id), headers=the_headers())
    assert response.status_code == HTTPStatus.OK
    assert json.loads(response.data)["name"] == an_updated_tasks_list_name()


def the_last_selected_time_is_updated():
    global response
    assert response.status_code == HTTPStatus.NO_CONTENT
    response = client.get(tasks_list_url_with_id(tasks_list_id), headers=the_headers())
    assert response.status_code == HTTPStatus.OK
    assert (
        json.loads(response.data)["last_selected_time"]
        == the_updated_datetime.isoformat()
    )


def the_tasks_list_is_deleted():
    global response
    assert response.status_code == HTTPStatus.NO_CONTENT
    response = client.get(tasks_list_url_with_id(tasks_list_id), headers=the_headers())
    assert response.status_code == HTTPStatus.NOT_FOUND
    assert json.loads(response.data)["error"] == "Tasks list not found"


def the_task_is_added_to_the_tasks_list():
    global response
    assert response.status_code == HTTPStatus.CREATED
    task_id = json.loads(response.data)["id"]
    response = client.get(tasks_list_url_with_id(tasks_list_id), headers=the_headers())
    assert response.status_code == HTTPStatus.OK
    assert json.loads(response.data)["tasks"][0]["id"] == task_id
    assert json.loads(response.data)["tasks"][0]["content"] == "A Task"


def the_task_is_ticked_in_the_tasks_list():
    global response
    assert response.status_code == HTTPStatus.NO_CONTENT
    response = client.get(tasks_list_url_with_id(tasks_list_id), headers=the_headers())
    assert response.status_code == HTTPStatus.OK
    assert json.loads(response.data)["tasks"][0]["is_ticked"] is True


def the_task_is_removed_from_the_tasks_list():
    global response
    assert response.status_code == HTTPStatus.NO_CONTENT
    response = client.get(tasks_list_url_with_id(tasks_list_id), headers=the_headers())
    assert response.status_code == HTTPStatus.OK
    assert json.loads(response.data)["tasks"][21]["is_removed"] is True


def the_task_is_carried_in_the_tasks_list():
    global response
    assert response.status_code == HTTPStatus.NO_CONTENT
    response = client.get(tasks_list_url_with_id(tasks_list_id), headers=the_headers())
    assert response.status_code == HTTPStatus.OK
    assert json.loads(response.data)["tasks"][21]["is_carried"] is True
    assert json.loads(response.data)["tasks"][21]["page_count"] == 1


def the_tasks_list_is_shared():
    global response
    assert response.status_code == HTTPStatus.NO_CONTENT
    response = client.get(tasks_list_url_with_id(tasks_list_id), headers=the_headers())
    assert response.status_code == HTTPStatus.OK
    assert json.loads(response.data)["shared_with"][0] == another_email


def the_tasks_list_is_unshared():
    global response
    assert response.status_code == HTTPStatus.NO_CONTENT
    response = client.get(tasks_list_url_with_id(tasks_list_id), headers=the_headers())
    assert response.status_code == HTTPStatus.OK
    assert len(json.loads(response.data)["shared_with"]) == 0
