from src.domain.notes_list import NotesList
from tests.validations import validate_uuid4

notes_list: NotesList = NotesList(name="My Notes List")


def a_notes_list_name():
    return "My Notes List"


def creating_a_notes_list():
    global notes_list
    notes_list = NotesList(a_notes_list_name())


def a_notes_list():
    global notes_list
    notes_list = NotesList("My Notes List")


def a_notes_list_with_22_notes():
    global notes_list
    notes_list = NotesList("My Notes List")
    for _ in range(22):
        notes_list.add("wibble")


def a_notes_list_with_20_notes():
    global notes_list
    notes_list = NotesList("My Notes List")
    for _ in range(20):
        notes_list.add("wibble")


def adding_a_note_to_notes_list(note_text):
    global notes_list
    notes_list.add(note_text)


def ticking_a_note():
    global notes_list
    if len(notes_list.notes) == 0:
        notes_list.tick("wibble")
    else:
        notes_list.tick(notes_list.notes[0].id)


def ticking_the_first_note():
    global notes_list
    notes_list.tick(notes_list.notes[0].id)


def adding_two_notes():
    global notes_list
    notes_list.add("wibble")
    notes_list.add("wobble")


def carrying_the_first_note():
    global notes_list
    notes_list.carry(notes_list.notes[0].id)


def removing_the_first_note():
    global notes_list
    notes_list.remove(notes_list.notes[0].id)


def carrying_all_notes_except_the_ticked_one():
    for note in notes_list.notes[1:]:
        notes_list.carry(note.id)


def the_note_is_ticked():
    assert notes_list.notes[0].is_ticked is True


def the_notes_list_is_empty():
    assert notes_list.name == a_notes_list_name()
    assert len(notes_list.notes) == 0


def the_notes_list_contains_a_note_with_text(note_text):
    assert len(notes_list.notes) == 1
    assert notes_list.notes[0].content == note_text
    assert validate_uuid4(notes_list.notes[0].id) is True


def the_first_note_is_carried():
    assert notes_list.notes[0].is_carried is True


def the_first_note_is_marked_for_removal():
    assert notes_list.notes[0].is_removed is True


def carrying_the_first_eleven_notes():
    for note in notes_list.notes[:11]:
        notes_list.carry(note.id)


def removing_the_next_eleven_notes():
    for note in notes_list.notes[11:]:
        notes_list.remove(note.id)


def notes_have_been_carried_twice():
    global notes_list
    for note in notes_list.notes:
        notes_list.carry(note.id)
    for note in notes_list.notes:
        notes_list.carry(note.id)


def removing_all_notes():
    global notes_list
    for note in notes_list.notes:
        notes_list.remove(note.id)


def the_first_eleven_notes_are_carried():
    for note in notes_list.notes[:11]:
        assert note.page_count == 1


def the_first_eleven_notes_have_a_page_count_of_1():
    for note in notes_list.notes[:11]:
        assert note.page_count == 1


def the_next_eleven_notes_are_removed():
    assert len(notes_list.notes) == 11


def the_ticked_note_is_removed():
    assert len(notes_list.notes) == 21
    assert all([note.is_ticked is False for note in notes_list.notes])
