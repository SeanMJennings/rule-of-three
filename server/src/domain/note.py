import uuid


class Note:
    def __init__(self, id: uuid.UUID, content: str):
        self.id = id
        self.content = content

    def __init__(self, content: str):
        self.id = uuid.uuid4()
        self.content = content
