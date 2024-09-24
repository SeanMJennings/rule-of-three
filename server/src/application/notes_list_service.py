from azure.cosmos import ContainerProxy
from src.domain.notes_list import NotesList
from src.persistence.converters import convert_to_domain


class NotesListService:

    def __init__(self, db: ContainerProxy):
        self.db = db

    def add(self, name: str):
        notes_list = NotesList(name)
        item = self.db.upsert_item(notes_list.to_dict())
        return item["id"]

    def update(self, name: str, new_name: str):
        notes_list = self.get(name)
        if self.get(new_name) is not None:
            raise ValueError("Notes list with name already exists")
        notes_list.name = new_name
        item = self.db.upsert_item(notes_list.to_dict())
        return item["id"]

    def delete(self, name: str):
        notes_list = self.get(name)
        self.db.delete_item(
            notes_list.id,
            notes_list.id,
        )

    def get(self, name: str) -> NotesList | None:
        items = self.db.query_items(
            query="SELECT * FROM c WHERE c.name = @name",
            parameters=[dict(name="@name", value=name)],
            enable_cross_partition_query=True,
        )
        return convert_to_domain(NotesList, items)

    def get_by_id(self, id: str) -> NotesList | None:
        items = self.db.query_items(
            query="SELECT * FROM c WHERE c.id = @id",
            parameters=[dict(name="@id", value=id)],
            enable_cross_partition_query=True,
        )
        return convert_to_domain(NotesList, items)

    def add_note(self, notes_list_id: str, note: str):
        notes_list = self.get_by_id(notes_list_id)
        notes_list.add(note)
        self.db.upsert_item(notes_list.to_dict())

    def tick_note(self, notes_list_id: str, note_id: str):
        notes_list = self.get_by_id(notes_list_id)
        notes_list.tick(note_id)
        self.db.upsert_item(notes_list.to_dict())

    def remove_note(self, notes_list_id: str, note_id: str):
        notes_list = self.get_by_id(notes_list_id)
        notes_list.remove(note_id)
        self.db.upsert_item(notes_list.to_dict())

    def carry_note(self, notes_list_id: str, note_id: str):
        notes_list = self.get_by_id(notes_list_id)
        notes_list.carry(note_id)
        self.db.upsert_item(notes_list.to_dict())
