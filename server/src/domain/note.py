import uuid


class Note:
    def __init__(
        self,
        id: uuid.UUID,
        content: str,
        is_ticked: bool,
        is_carried: bool,
        is_removed: bool,
        page_count: int,
    ):
        self.id = id
        self.content = content
        self.is_ticked = is_ticked
        self.is_carried = is_carried
        self.is_removed = is_removed
        self.page_count = page_count

    def __init__(self, content: str):
        self.id = uuid.uuid4()
        self.content = content
        self.is_ticked = False
        self.is_carried = False
        self.is_removed = False
        self.page_count = 0

    def tick(self):
        self.is_ticked = True

    def carry(self):
        self.is_carried = True
        self.page_count += 1

    def remove(self):
        self.is_removed = True

    def carried(self):
        self.is_carried = False
