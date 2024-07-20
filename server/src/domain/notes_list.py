from src.domain.note import Note


class NotesList:

    def __init__(self, name: str):
        self.name = name
        self.notes = []

    def add(self, note: str):
        if len(self.notes) == 22:
            raise Exception("Notes list is full")
        self.notes.append(Note(note))
