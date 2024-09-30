from src.handlers.notes_list_handler import (
    NotesListHandlerForGroups,
    NotesListHandlerForItems,
)
from flask import Flask


def create_app(notes_list_service):
    app = Flask(__name__)
    notes_list_handler_for_groups = NotesListHandlerForGroups.as_view(
        NotesListHandlerForGroups.name(), notes_list_service
    )
    notes_list_handler_for_items = NotesListHandlerForItems.as_view(
        NotesListHandlerForItems.name(), notes_list_service
    )
    __add_app_url(app, NotesListHandlerForGroups.route(), notes_list_handler_for_groups)
    __add_app_url(app, NotesListHandlerForItems.route(), notes_list_handler_for_items)
    return app


# routePrefix in host.json does not work, so this is used instead
def __add_app_url(app, route, handler):
    app.add_url_rule(
        "/api" + route,
        view_func=handler,
    )
    return app
