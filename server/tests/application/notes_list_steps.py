import pytest
from azure.cosmos import ContainerProxy
from src.application.notes_list_service import NotesListService
from src.domain.notes_list import NotesList
from tests.database import setup_db, get_db_connection, clear_db

db: ContainerProxy
notes_list_service: NotesListService
notes_list: NotesList
another_notes_list: NotesList
notes_list_id: str


@pytest.fixture(autouse=True)
def setup_and_teardown():
    global db, notes_list_service
    setup_db()
    db = get_db_connection()
    notes_list_service = NotesListService(db)
    yield
    clear_db()


def a_notes_list_name():
    return "My Notes List"


def another_notes_list_name():
    return "Another Notes List"


def creating_a_notes_list():
    global notes_list_service, notes_list_id
    notes_list_id = notes_list_service.add(a_notes_list_name())


def creating_another_notes_list():
    global notes_list_service
    notes_list_service.add(another_notes_list_name())


def renaming_a_notes_list():
    global notes_list_service
    notes_list_service.update(a_notes_list_name(), "My Renamed Notes List")


def renaming_a_notes_list_to_existing_name():
    global notes_list_service
    notes_list_service.update(a_notes_list_name(), another_notes_list_name())


def deleting_a_notes_list():
    global notes_list_service
    notes_list_service.delete(a_notes_list_name())


def an_existing_notes_list():
    creating_a_notes_list()
    global notes_list_service, notes_list
    notes_list = notes_list_service.get(a_notes_list_name())


def another_existing_notes_list():
    creating_another_notes_list()
    global notes_list_service, another_notes_list
    another_notes_list = notes_list_service.get(a_notes_list_name())


def adding_a_note():
    global notes_list_service, notes_list
    notes_list_service.add_note(notes_list.id, "My Note")


def an_existing_notes_list_with_a_note():
    global notes_list_service, notes_list
    an_existing_notes_list()
    adding_a_note()
    notes_list = notes_list_service.get(a_notes_list_name())


def an_existing_notes_list_which_is_full():
    global notes_list_service, notes_list
    an_existing_notes_list()
    for i in range(22):
        notes_list_service.add_note(notes_list.id, f"My Note {i}")
    notes_list = notes_list_service.get(a_notes_list_name())


def ticking_a_note():
    global notes_list_service, notes_list
    notes_list_service.tick_note(notes_list.id, notes_list.notes[0].id)


def removing_a_note():
    global notes_list_service, notes_list
    notes_list_service.remove_note(notes_list.id, notes_list.notes[0].id)


def carrying_a_note():
    global notes_list_service, notes_list
    notes_list_service.carry_note(notes_list.id, notes_list.notes[0].id)


def the_notes_list_can_be_retrieved():
    global notes_list_service, notes_list
    notes_list = notes_list_service.get(a_notes_list_name())
    assert notes_list.id == notes_list_id
    assert notes_list.name == "My Notes List"


def the_notes_list_is_renamed():
    global notes_list_service, notes_list
    notes_list = notes_list_service.get("My Renamed Notes List")
    assert notes_list.name == "My Renamed Notes List"


def the_notes_list_is_deleted():
    global notes_list_service
    assert notes_list_service.get(a_notes_list_name()) is None


def the_note_is_added_to_the_notes_list():
    global notes_list_service, notes_list
    notes_list = notes_list_service.get(a_notes_list_name())
    assert len(notes_list.notes) == 1
    assert notes_list.notes[0].content == "My Note"


def the_note_is_ticked_in_the_notes_list():
    global notes_list_service, notes_list
    notes_list = notes_list_service.get(a_notes_list_name())
    assert len(notes_list.notes) == 1
    assert notes_list.notes[0].is_ticked is True


def the_note_is_removed_from_the_notes_list():
    global notes_list_service, notes_list
    notes_list = notes_list_service.get(a_notes_list_name())
    assert len(notes_list.notes) == 22
    assert notes_list.notes[0].is_removed is True


def the_note_is_carried_in_the_notes_list():
    global notes_list_service, notes_list
    notes_list = notes_list_service.get(a_notes_list_name())
    assert len(notes_list.notes) == 22
    assert notes_list.notes[0].is_carried is True
