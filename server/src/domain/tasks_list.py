import uuid
from src.domain.task import Task


class TasksList:

    def __init__(
        self, name: str, owner_id: str, tasks: list[Task] = None, id: str = None
    ):
        self.name = name
        self.owner_id = owner_id
        if id is None:
            self.id = str(uuid.uuid4())
        else:
            self.id = id
        if tasks is not None:
            self.tasks = tasks
        else:
            self.tasks = []

    @staticmethod
    def from_dict(dictionary):
        return TasksList(
            dictionary["name"],
            dictionary["owner_id"],
            [Task.from_dict(task) for task in dictionary["tasks"]],
            dictionary["id"],
        )

    def to_dict(self):
        return {
            "name": self.name,
            "owner_id": self.owner_id,
            "tasks": [task.to_dict() for task in self.tasks],
            "id": self.id,
        }

    def add(self, task: str):
        if len(self.tasks) == 22:
            raise Exception(
                "Tasks list holds 22 tasks. Each task must be carried or removed"
            )
        the_task = Task(task)
        self.tasks.append(the_task)
        return the_task.id

    def tick(self, task_id: str):
        for index, task in enumerate(self.tasks):
            if task.id == task_id:
                self.tasks[index] = task.tick()
                return
        raise Exception("Task not found")

    def carry(self, task_id: str):
        if not self.__list_is_full():
            raise Exception("Tasks list is not yet full")
        for index, task in enumerate(self.tasks):
            if task.id == task_id:
                if task.page_count == 2:
                    raise Exception("Task has been carried twice and must be removed")
                if task.is_ticked:
                    raise Exception("Ticked tasks cannot be carried")
                self.tasks[index] = task.carry()
                self.__last_task_carried_or_removed()
                return
        raise Exception("Task not found")

    def remove(self, task_id: str):
        if not self.__list_is_full():
            raise Exception("Tasks list is not yet full")
        for index, task in enumerate(self.tasks):
            if task.id == task_id:
                if task.is_ticked:
                    raise Exception("Ticked tasks cannot be marked for removal")
                self.tasks[index] = task.remove()
                self.__last_task_carried_or_removed()
                return
        raise Exception("Task not found")

    def __last_task_carried_or_removed(self):
        if all(
            [
                task.is_carried or task.is_removed or task.is_ticked
                for task in self.tasks
            ]
        ):
            self.tasks = list(
                filter(lambda n: n.is_removed is False and not n.is_ticked, self.tasks)
            )
            for index, task in enumerate(self.tasks):
                self.tasks[index] = task.carried()

    def __list_is_full(self):
        return len(self.tasks) == 22
