from azure.cosmos import ContainerProxy

from src.application.not_found_exception import NotFoundException
from src.domain.tasks_list import TasksList
from src.persistence.converters import convert_to_domain, convert_to_domain_list
from src.application.validation_exception import ValidationException


class TasksListService:

    def __init__(self, db: ContainerProxy):
        self.db = db

    def add(self, name: str, owner_id: str):
        tasks_list = TasksList(name, owner_id)
        if self.get(name, owner_id) is not None:
            raise ValidationException("Tasks list with name already exists")
        item = self.db.upsert_item(tasks_list.to_dict())
        return item["id"]

    def update(self, id: str, owner_id: str, new_name: str):
        tasks_list = self.get(new_name, owner_id)
        if tasks_list is not None and tasks_list.id != id:
            raise ValidationException("Tasks list with name already exists")

        tasks_list = self.get_by_id(id, owner_id)
        self.__check_task_list_found(tasks_list)
        tasks_list.name = new_name
        item = self.db.upsert_item(tasks_list.to_dict())
        return item["id"]

    def update_last_selected_time(self, id: str, owner_id: str):
        tasks_list = self.get_by_id(id, owner_id)
        self.__check_task_list_found(tasks_list)
        tasks_list.update_last_selected_time()
        self.db.upsert_item(tasks_list.to_dict())

    def delete(self, id: str, owner_id: str):
        tasks_list = self.get_by_id(id, owner_id)
        self.__check_task_list_found(tasks_list)
        self.db.delete_item(
            tasks_list.id,
            tasks_list.owner_id,
        )

    def get(self, name: str, owner_id: str) -> TasksList | None:
        item = self.db.query_items(
            query="SELECT * FROM c WHERE c.name = @name and c.owner_id = @owner_id",
            parameters=[
                dict(name="@name", value=name),
                dict(name="@owner_id", value=owner_id),
            ],
            enable_cross_partition_query=True,
        )
        return convert_to_domain(TasksList, item)

    def get_by_id(self, id: str, owner_id: str) -> TasksList | None:
        item = self.db.query_items(
            query="SELECT * FROM c WHERE c.id = @id and c.owner_id = @owner_id",
            parameters=[
                dict(name="@id", value=id),
                dict(name="@owner_id", value=owner_id),
            ],
            enable_cross_partition_query=True,
        )
        return convert_to_domain(TasksList, item)

    def get_all(self, owner_id: str) -> list[TasksList]:
        items = self.db.query_items(
            query="SELECT * FROM c WHERE c.owner_id = @owner_id",
            parameters=[dict(name="@owner_id", value=owner_id)],
            enable_cross_partition_query=True,
        )
        return convert_to_domain_list(TasksList, items)

    def add_task(self, tasks_list_id: str, owner_id: str, task: str):
        tasks_list = self.get_by_id(tasks_list_id, owner_id)
        self.__check_task_list_found(tasks_list)
        the_task_id = tasks_list.add(task)
        self.db.upsert_item(tasks_list.to_dict())
        return the_task_id

    def tick_task(self, tasks_list_id: str, owner_id: str, task_id: str):
        tasks_list = self.get_by_id(tasks_list_id, owner_id)
        self.__check_task_list_found(tasks_list)
        tasks_list.tick(task_id)
        self.db.upsert_item(tasks_list.to_dict())

    def remove_task(self, tasks_list_id: str, owner_id: str, task_id: str):
        tasks_list = self.get_by_id(tasks_list_id, owner_id)
        self.__check_task_list_found(tasks_list)
        tasks_list.remove(task_id)
        self.db.upsert_item(tasks_list.to_dict())

    def carry_task(self, tasks_list_id: str, owner_id: str, task_id: str):
        tasks_list = self.get_by_id(tasks_list_id, owner_id)
        self.__check_task_list_found(tasks_list)
        tasks_list.carry(task_id)
        self.db.upsert_item(tasks_list.to_dict())

    @staticmethod
    def __check_task_list_found(tasks_list):
        if tasks_list is None:
            raise NotFoundException("Tasks list not found")
