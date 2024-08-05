from pydapper import commands

from src.domain.notes_list import NotesList


class NotesListService:

    def __init__(self, db: commands.Commands):
        self.db = db

    def add(self, name: str):
        self.db.execute(
            "INSERT INTO dbo.NotesLists (name) values (?name?)", param={"name": name}
        )

    def get(self, name: str):
        return self.db.query_first(
            "SELECT id, name FROM dbo.NotesLists where name = ?name?",
            param={"name": name},
            model=NotesList,
        )
