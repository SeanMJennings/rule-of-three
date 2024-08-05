import pytest

from src.application.notes_list_service import NotesListService
from tests.database import clear_db, get_pydapper_db_connection
from pydapper import commands

db: commands
notes_list_service: NotesListService


@pytest.fixture(autouse=True)
def setup_and_teardown():
    global db, notes_list_service
    db = get_pydapper_db_connection()
    notes_list_service = NotesListService(db)
    yield
    db.connection.close()
    clear_db()


def a_notes_list_name():
    return "My Notes List"


def creating_a_notes_list():
    global notes_list_service
    notes_list_service.add(a_notes_list_name())


def the_notes_list_can_be_retrieved():
    global notes_list_service
    notes_list = notes_list_service.get(a_notes_list_name())
    assert notes_list.name == "My Notes List"
