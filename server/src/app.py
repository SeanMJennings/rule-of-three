from src.handlers.tasks_list_handlers import (
    TasksListHandlerForGroups,
    TasksListHandlerForItems,
    AddTaskToTasksListHandler,
)
from flask import Flask


def create_app(tasks_list_service):
    app = Flask(__name__)
    tasks_list_handler_for_groups = TasksListHandlerForGroups.as_view(
        TasksListHandlerForGroups.name(), tasks_list_service
    )
    tasks_list_handler_for_items = TasksListHandlerForItems.as_view(
        TasksListHandlerForItems.name(), tasks_list_service
    )
    add_tasks_to_tasks_list_handler = AddTaskToTasksListHandler.as_view(
        AddTaskToTasksListHandler.name(), tasks_list_service
    )
    __add_app_url(app, TasksListHandlerForGroups.route(), tasks_list_handler_for_groups)
    __add_app_url(app, TasksListHandlerForItems.route(), tasks_list_handler_for_items)
    __add_app_url(
        app, AddTaskToTasksListHandler.route(), add_tasks_to_tasks_list_handler
    )
    return app


# routePrefix in host.json does not work, so this is used instead
def __add_app_url(app, route, handler):
    app.add_url_rule(
        "/api" + route,
        view_func=handler,
    )
    return app
