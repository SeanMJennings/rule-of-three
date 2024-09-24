from flask.views import MethodView
from flask import request
from .converters import convert_to_response
from .requests import get_request_body_property

from src.application.notes_list_service import NotesListService


class NotesListHandlerForGroups(MethodView):
    init_every_request = False

    @staticmethod
    def route():
        return "/notes"

    @staticmethod
    def name():
        return "notes_list_handler_for_groups"

    def __init__(self, notes_list_service: NotesListService):
        self.notes_list_service = notes_list_service

    def post(self):
        id = self.notes_list_service.add(get_request_body_property(request, "name"))
        return {"id": id}


class NotesListHandlerForItems(MethodView):
    init_every_request = False

    @staticmethod
    def route():
        return "/notes/<id>"

    @staticmethod
    def name():
        return "notes_list_handler_for_items"

    def __init__(self, notes_list_service: NotesListService):
        self.notes_list_service = notes_list_service

    def get(self, id):
        return convert_to_response(self.notes_list_service.get_by_id(id))
