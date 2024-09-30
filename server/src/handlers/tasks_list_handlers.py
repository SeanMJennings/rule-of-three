from flask.views import MethodView
from flask import request
from .requests import get_request_body_property
from .responses import *
from src.application.tasks_list_service import TasksListService


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
