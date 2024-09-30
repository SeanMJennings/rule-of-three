from flask.views import MethodView
from flask import request, Response
from .converters import convert_to_response
from .requests import get_request_body_property
import http
import json

from src.application.tasks_list_service import TasksListService


class TasksListHandlerForGroups(MethodView):
    init_every_request = False

    @staticmethod
    def route():
        return "/tasks_lists"

    @staticmethod
    def name():
        return "tasks_list_handler_for_groups"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def post(self):
        id = self.tasks_list_service.add(get_request_body_property(request, "name"))
        return Response(response=json.dumps({"id": id}), status=http.client.CREATED)


class TasksListHandlerForItems(MethodView):
    init_every_request = False

    @staticmethod
    def route():
        return "/tasks_lists/<id>"

    @staticmethod
    def name():
        return "tasks_list_handler_for_items"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def get(self, id):
        return convert_to_response(self.tasks_list_service.get_by_id(id))

    def patch(self, id):
        id = self.tasks_list_service.update(
            id,
            get_request_body_property(request, "name"),
        )
        return Response(status=http.client.NO_CONTENT)
