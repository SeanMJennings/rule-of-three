from src.application.notes_list_service import NotesListService
from src.handlers.notes_list_handler import (
    NotesListHandlerForGroups,
    NotesListHandlerForItems,
)
from src.persistence.initialise_cosmos import container
from flask import Flask


def create_app():
    app = Flask(__name__)
    notes_list_service = NotesListService(container)
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


if __name__ == "__main__":
    create_app().run()
