from azure.cosmos import ContainerProxy
from src.domain.notes_list import NotesList
import json


class NotesListService:

    def __init__(self, db: ContainerProxy):
        self.db = db

    def add(self, name: str):
        notes_list = NotesList(name)
        self.db.upsert_item(notes_list.__dict__)

    def get(self, name: str):
        items = self.db.query_items(
            query="SELECT * FROM c WHERE c.name = @name",
            parameters=[dict(name="@name", value=name)],
            enable_cross_partition_query=True,
        )
        data = json.dumps(next(iter(items)), indent=True)
        return json.loads(data, object_hook=lambda d: NotesList(**d))
