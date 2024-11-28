import uuid
from dataclasses import dataclass, field


def get_new_uuid() -> uuid:
    return str(uuid.uuid4())


@dataclass(frozen=True)
class Task:
    content: str
    id: str = field(default_factory=get_new_uuid)
    is_ticked: bool = False
    is_carried: bool = False
    is_removed: bool = False
    page_count: int = 0

    def to_dict(self):
        return {
            "content": self.content,
            "id": self.id,
            "is_ticked": self.is_ticked,
            "is_carried": self.is_carried,
            "is_removed": self.is_removed,
            "page_count": self.page_count,
        }

    @staticmethod
    def from_dict(dictionary):
        return Task(
            dictionary["content"],
            dictionary["id"],
            dictionary["is_ticked"],
            dictionary["is_carried"],
            dictionary["is_removed"],
            dictionary["page_count"],
        )

    def set_content(self, content):
        return Task(
            content,
            self.id,
            self.is_ticked,
            self.is_carried,
            self.is_removed,
            self.page_count,
        )

    def tick(self):
        return Task(
            self.content,
            self.id,
            True,
            self.is_carried,
            self.is_removed,
            self.page_count,
        )

    def carry(self):
        return Task(
            self.content,
            self.id,
            self.is_ticked,
            True,
            self.is_removed,
            self.page_count + 1,
        )

    def remove(self):
        return Task(
            self.content,
            self.id,
            self.is_ticked,
            self.is_carried,
            True,
            self.page_count,
        )

    def carried(self):
        return Task(
            self.content,
            self.id,
            self.is_ticked,
            False,
            self.is_removed,
            self.page_count,
        )
