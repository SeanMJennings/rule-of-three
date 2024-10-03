from flask.views import MethodView
from flask import request
from .requests import get_request_body_property
from .responses import *
from src.application.tasks_list_service import TasksListService
from src._app import __add_app_url


class TasksListHandlerForGroups(MethodView):
    init_every_request = False

    @staticmethod
    def route():
        return "/tasks_list"

    @staticmethod
    def name():
        return "tasks_list_handler_for_groups"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def get(self):
        return success_response(self.tasks_list_service.get_all())

    def post(self):
        id = self.tasks_list_service.add(get_request_body_property(request, "name"))
        return created_response({"id": id})


class TasksListHandlerForItems(MethodView):
    init_every_request = False

    @staticmethod
    def route():
        return "/tasks_list/<id>"

    @staticmethod
    def name():
        return "tasks_list_handler_for_items"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def get(self, id):
        tasks_list = self.tasks_list_service.get_by_id(id)
        if tasks_list is None:
            return not_found_response("Tasks list not found")
        return success_response(tasks_list)

    def patch(self, id):
        self.tasks_list_service.update(
            id,
            get_request_body_property(request, "name"),
        )
        return no_content_response()

    def delete(self, id):
        self.tasks_list_service.delete(id)
        return no_content_response()


class AddTaskHandler(MethodView):
    init_every_request = False

    @staticmethod
    def route():
        return "/tasks_list/<tasks_list_id>/task"

    @staticmethod
    def name():
        return "add_task_handler"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def post(self, tasks_list_id):
        task_id = self.tasks_list_service.add_task(
            tasks_list_id, get_request_body_property(request, "task")
        )
        return created_response({"id": task_id})


class TickTaskHandler(MethodView):
    init_every_request = False

    @staticmethod
    def route():
        return "/tasks_list/<tasks_list_id>/task/<task_id>/tick"

    @staticmethod
    def name():
        return "tick_task_handler"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def patch(self, tasks_list_id, task_id):
        self.tasks_list_service.tick_task(tasks_list_id, task_id)
        return no_content_response()


def register_handlers(app, tasks_list_service):
    tasks_list_handler_for_groups = TasksListHandlerForGroups.as_view(
        TasksListHandlerForGroups.name(), tasks_list_service
    )
    tasks_list_handler_for_items = TasksListHandlerForItems.as_view(
        TasksListHandlerForItems.name(), tasks_list_service
    )
    add_tasks_handler = AddTaskHandler.as_view(
        AddTaskHandler.name(), tasks_list_service
    )
    tick_task_handler = TickTaskHandler.as_view(
        TickTaskHandler.name(), tasks_list_service
    )
    __add_app_url(app, TasksListHandlerForGroups.route(), tasks_list_handler_for_groups)
    __add_app_url(app, TasksListHandlerForItems.route(), tasks_list_handler_for_items)
    __add_app_url(app, AddTaskHandler.route(), add_tasks_handler)
    __add_app_url(app, TickTaskHandler.route(), tick_task_handler)
    return app
