from src.domain.notes_list import NotesList
from tests.validations import validate_uuid4

notes_list = None


def a_notes_list_name():
    return "My Notes List"


def creating_a_notes_list():
    global notes_list
    notes_list = NotesList(a_notes_list_name())


def the_notes_list_is_empty():
    assert notes_list.name == a_notes_list_name()
    assert len(notes_list.notes) == 0


def adding_a_note_to_notes_list(note_text):
    global notes_list
    notes_list.add(note_text)


def the_notes_list_contains_a_note_with_text(note_text):
    assert len(notes_list.notes) == 1
    assert notes_list.notes[0].content == note_text
    assert validate_uuid4(notes_list.notes[0].id) is True
