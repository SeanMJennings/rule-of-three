import uuid
from dataclasses import dataclass, field


def get_new_uuid() -> uuid:
    return uuid.uuid4()


@dataclass(frozen=True)
class Note:
    content: str
    id: uuid.UUID = field(default_factory=get_new_uuid)
    is_ticked: bool = False
    is_carried: bool = False
    is_removed: bool = False
    page_count: int = 0

    def tick(self):
        return Note(
            self.content,
            self.id,
            True,
            self.is_carried,
            self.is_removed,
            self.page_count,
        )

    def carry(self):
        return Note(
            self.content,
            self.id,
            self.is_ticked,
            True,
            self.is_removed,
            self.page_count + 1,
        )

    def remove(self):
        return Note(
            self.content,
            self.id,
            self.is_ticked,
            self.is_carried,
            True,
            self.page_count,
        )

    def carried(self):
        return Note(
            self.content,
            self.id,
            self.is_ticked,
            False,
            self.is_removed,
            self.page_count,
        )
