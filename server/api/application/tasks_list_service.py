from azure.cosmos import ContainerProxy

from api.application.not_found_exception import NotFoundException
from api.application.string_encoding import decode_string, encode_string
from api.domain.tasks_list import TasksList
from api.persistence.converters import convert_to_domain, convert_to_domain_list
from api.application.validation_exception import ValidationException


class TasksListService:

    def __init__(self, db: ContainerProxy):
        self.db = db

    def add(self, name: str, owner_email: str):
        tasks_list = TasksList(name, owner_email)
        if self.get(name, owner_email) is not None:
            raise ValidationException("Tasks list with name already exists")
        self.__encoded_tasks_list(tasks_list)
        item = self.db.upsert_item(tasks_list.to_dict())
        return item["id"]

    def update(self, id: str, owner_email: str, new_name: str):
        tasks_list = self.get(new_name, owner_email)
        if tasks_list is not None and tasks_list.id != id:
            raise ValidationException("Tasks list with name already exists")

        tasks_list = self.get_by_id(id, owner_email)
        self.__check_task_list_found(tasks_list)
        tasks_list.name = new_name
        self.__encoded_tasks_list(tasks_list)
        item = self.db.upsert_item(tasks_list.to_dict())
        return item["id"]

    def update_last_selected_time(self, id: str, owner_email: str):
        tasks_list = self.get_by_id(id, owner_email)
        self.__check_task_list_found(tasks_list)
        tasks_list.update_last_selected_time()
        self.__encoded_tasks_list(tasks_list)
        self.db.upsert_item(tasks_list.to_dict())

    def delete(self, id: str, owner_email: str):
        tasks_list = self.get_by_id(id, owner_email)
        self.__check_task_list_found(tasks_list)
        self.db.delete_item(
            tasks_list.id,
            tasks_list.owner_email,
        )

    def get(self, name: str, owner_email: str) -> TasksList | None:
        item = self.db.query_items(
            query="SELECT * FROM c WHERE c.name = @name and c.owner_email = @owner_email",
            parameters=[
                dict(name="@name", value=name),
                dict(name="@owner_email", value=owner_email),
            ],
            enable_cross_partition_query=True,
        )
        return self.__decoded_tasks_list(convert_to_domain(TasksList, item))

    def get_by_id(self, id: str, owner_email: str) -> TasksList | None:
        item = self.db.query_items(
            query="SELECT * FROM c WHERE c.id = @id and c.owner_email = @owner_email",
            parameters=[
                dict(name="@id", value=id),
                dict(name="@owner_email", value=owner_email),
            ],
            enable_cross_partition_query=True,
        )
        return self.__decoded_tasks_list(convert_to_domain(TasksList, item))

    def get_all(self, owner_email: str) -> list[TasksList]:
        items = self.db.query_items(
            query="SELECT * FROM c WHERE c.owner_email = @owner_email",
            parameters=[dict(name="@owner_email", value=owner_email)],
            enable_cross_partition_query=True,
        )
        encoded_lists = convert_to_domain_list(TasksList, items)
        return list(
            self.__decoded_tasks_list(encoded_list) for encoded_list in encoded_lists
        )

    def add_task(self, tasks_list_id: str, owner_email: str, task: str):
        tasks_list = self.get_by_id(tasks_list_id, owner_email)
        self.__check_task_list_found(tasks_list)
        the_task_id = tasks_list.add(task)
        self.__encoded_tasks_list(tasks_list)
        self.db.upsert_item(tasks_list.to_dict())
        return the_task_id

    def tick_task(self, tasks_list_id: str, owner_email: str, task_id: str):
        tasks_list = self.get_by_id(tasks_list_id, owner_email)
        self.__check_task_list_found(tasks_list)
        tasks_list.tick(task_id)
        self.__encoded_tasks_list(tasks_list)
        self.db.upsert_item(tasks_list.to_dict())

    def remove_task(self, tasks_list_id: str, owner_email: str, task_id: str):
        tasks_list = self.get_by_id(tasks_list_id, owner_email)
        self.__check_task_list_found(tasks_list)
        tasks_list.remove(task_id)
        self.__encoded_tasks_list(tasks_list)
        self.db.upsert_item(tasks_list.to_dict())

    def carry_task(self, tasks_list_id: str, owner_email: str, task_id: str):
        tasks_list = self.get_by_id(tasks_list_id, owner_email)
        self.__check_task_list_found(tasks_list)
        tasks_list.carry(task_id)
        self.__encoded_tasks_list(tasks_list)
        self.db.upsert_item(tasks_list.to_dict())

    def share(self, tasks_list_id: str, owner_email: str, email_to_share: str):
        tasks_list = self.get_by_id(tasks_list_id, owner_email)
        self.__check_task_list_found(tasks_list)
        tasks_list.share(email_to_share)
        self.__encoded_tasks_list(tasks_list)
        self.db.upsert_item(tasks_list.to_dict())

    @staticmethod
    def __check_task_list_found(tasks_list):
        if tasks_list is None:
            raise NotFoundException("Tasks list not found")

    @staticmethod
    def __decoded_tasks_list(tasks_list: TasksList):
        if tasks_list is not None:
            tasks_list.__setattr__(
                "tasks",
                [
                    task.set_content(decode_string(task.content))
                    for task in tasks_list.tasks
                ],
            )
        return tasks_list

    @staticmethod
    def __encoded_tasks_list(tasks_list: TasksList):
        if tasks_list is not None:
            tasks_list.__setattr__(
                "tasks",
                [
                    task.set_content(encode_string(task.content))
                    for task in tasks_list.tasks
                ],
            )
        return tasks_list
