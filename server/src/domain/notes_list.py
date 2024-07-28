from src.domain.note import Note


class NotesList:

    def __init__(self, name: str):
        self.name = name
        self.notes = []

    def add(self, note: str):
        if len(self.notes) == 22:
            raise Exception(
                "Notes list holds 22 notes. Each note must be carried or removed"
            )
        self.notes.append(Note(note))

    def tick(self, note_id: str):
        for note in self.notes:
            if note.id == note_id:
                note.tick()
                return
        raise Exception("Note not found")

    def carry(self, note_id: str):
        for note in self.notes:
            if note.id == note_id:
                note.carry()
                self.last_note_carried_or_removed()
                return
        raise Exception("Note not found")

    def remove(self, note_id: str):
        for note in self.notes:
            if note.id == note_id:
                note.remove()
                self.last_note_carried_or_removed()
                return
        raise Exception("Note not found")

    def last_note_carried_or_removed(self):
        if all([note.is_carried or note.is_removed for note in self.notes]):
            self.notes = list(filter(lambda n: n.is_removed == False, self.notes))
