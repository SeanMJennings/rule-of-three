import pytest
import json
from tests.handlers.routing import notes_url
from src.main import create_app
from tests.handlers.routing import notes_url_with_id

response = None
client = None


@pytest.fixture(autouse=True)
def setup_and_teardown():
    global client
    client = create_app().test_client()
    yield
    client.__exit__(None, None, None)


def a_notes_list_name():
    return "My Notes List"


def adding_a_notes_list():
    global response
    response = client.post(notes_url(), json={"name": a_notes_list_name()})


def the_notes_list_is_added():
    global response
    assert response.status_code == 200
    response = client.get(notes_url_with_id(json.loads(response.data)["id"]))
    assert response.status_code == 200
    assert json.loads(response.data)["name"] == a_notes_list_name()
