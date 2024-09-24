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
    app.add_url_rule(
        NotesListHandlerForGroups.route(), view_func=notes_list_handler_for_groups
    )
    app.add_url_rule(
        NotesListHandlerForItems.route(), view_func=notes_list_handler_for_items
    )
    return app
