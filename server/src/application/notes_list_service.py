from azure.cosmos import ContainerProxy
from src.domain.notes_list import NotesList
from typing import TypeVar

T = TypeVar("T")


class NotesListService:

    def __init__(self, db: ContainerProxy):
        self.db = db

    def add(self, name: str):
        notes_list = NotesList(name)
        self.db.upsert_item(notes_list.to_dict())

    def get(self, name: str) -> NotesList:
        items = self.db.query_items(
            query="SELECT * FROM c WHERE c.name = @name",
            parameters=[dict(name="@name", value=name)],
            enable_cross_partition_query=True,
        )
        return self.__convert_to_domain(NotesList, items)

    def get_by_id(self, id: str) -> NotesList:
        items = self.db.query_items(
            query="SELECT * FROM c WHERE c.id = @id",
            parameters=[dict(name="@id", value=id)],
            enable_cross_partition_query=True,
        )
        return self.__convert_to_domain(NotesList, items)

    def add_note(self, notes_list_id: str, note: str):
        notes_list = self.get_by_id(notes_list_id)
        notes_list.add(note)
        self.db.upsert_item(notes_list.to_dict())

    @staticmethod
    def __convert_to_domain(_type: T, items):
        return _type.from_dict(next(iter(items)))
