from pydapper import connect

from src.domain.notes_list import NotesList


class NotesListService:

    def __init__(self, db: connect):
        self.db = db

    def add(self, name: str):
        self.db.execute("INSERT INTO notes_list (name) VALUES (?)", [name])

    def get(self, name: str):
        return self.db.query(
            "SELECT * FROM notes_list WHERE name = ?", [name], model=NotesList
        )
