from azure.cosmos import ContainerProxy
from src.domain.tasks_list import TasksList
from src.persistence.converters import convert_to_domain


class TasksListService:

    def __init__(self, db: ContainerProxy):
        self.db = db

    def add(self, name: str):
        tasks_list = TasksList(name)
        if self.get(name) is not None:
            raise ValueError("Tasks list with name already exists")
        item = self.db.upsert_item(tasks_list.to_dict())
        return item["id"]

    def update(self, id: str, new_name: str):
        if self.get(new_name) is not None:
            raise ValueError("Tasks list with name already exists")
        tasks_list = self.get_by_id(id)
        tasks_list.name = new_name
        item = self.db.upsert_item(tasks_list.to_dict())
        return item["id"]

    def delete(self, id: str):
        tasks_list = self.get_by_id(id)
        self.db.delete_item(
            tasks_list.id,
            tasks_list.id,
        )

    def get(self, name: str) -> TasksList | None:
        item = self.db.query_items(
            query="SELECT * FROM c WHERE c.name = @name",
            parameters=[dict(name="@name", value=name)],
            enable_cross_partition_query=True,
        )
        return convert_to_domain(TasksList, item)

    def get_by_id(self, id: str) -> TasksList | None:
        item = self.db.query_items(
            query="SELECT * FROM c WHERE c.id = @id",
            parameters=[dict(name="@id", value=id)],
            enable_cross_partition_query=True,
        )
        return convert_to_domain(TasksList, item)

    def get_all(self) -> list[TasksList]:
        items = self.db.query_items(
            query="SELECT * FROM c",
            enable_cross_partition_query=True,
        )
        return convert_to_domain(TasksList, items)

    def add_task(self, tasks_list_id: str, task: str):
        tasks_list = self.get_by_id(tasks_list_id)
        tasks_list.add(task)
        self.db.upsert_item(tasks_list.to_dict())

    def tick_task(self, tasks_list_id: str, task_id: str):
        tasks_list = self.get_by_id(tasks_list_id)
        tasks_list.tick(task_id)
        self.db.upsert_item(tasks_list.to_dict())

    def remove_task(self, tasks_list_id: str, task_id: str):
        tasks_list = self.get_by_id(tasks_list_id)
        tasks_list.remove(task_id)
        self.db.upsert_item(tasks_list.to_dict())

    def carry_task(self, tasks_list_id: str, task_id: str):
        tasks_list = self.get_by_id(tasks_list_id)
        tasks_list.carry(task_id)
        self.db.upsert_item(tasks_list.to_dict())
