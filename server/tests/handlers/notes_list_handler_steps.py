import pytest
import json

from src.application.notes_list_service import NotesListService
from tests.handlers.routing import notes_url
from src.app import create_app
from tests.handlers.routing import notes_url_with_id
from tests.database import setup_db, get_db_connection, clear_db

response = None
client = None
notes_id = None


@pytest.fixture(autouse=True)
def setup_and_teardown():
    global client
    setup_db()
    client = create_app(NotesListService(get_db_connection())).test_client()
    yield
    client.__exit__(None, None, None)
    clear_db()


def a_notes_list_name():
    return "My Notes List"


def an_updated_notes_list_name():
    return "Updated Notes List"


def adding_a_notes_list():
    global response, notes_id
    response = client.post(notes_url(), json={"name": a_notes_list_name()})
    notes_id = json.loads(response.data)["id"]


def a_notes_list():
    adding_a_notes_list()


def updating_the_notes_list():
    global response
    response = client.patch(
        notes_url_with_id(notes_id),
        json={"name": an_updated_notes_list_name()},
    )


def the_notes_list_is_added():
    global response
    assert response.status_code == 201
    response = client.get(notes_url_with_id(notes_id))
    assert response.status_code == 200
    assert json.loads(response.data)["name"] == a_notes_list_name()


def the_notes_list_is_updated():
    global response
    assert response.status_code == 204
    response = client.get(notes_url_with_id(notes_id))
    assert response.status_code == 200
    assert json.loads(response.data)["name"] == an_updated_notes_list_name()
