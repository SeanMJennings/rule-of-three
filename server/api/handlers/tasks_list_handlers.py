﻿from flask.views import MethodView
from flask import request
from .auth_zero_decorators import requires_auth
from .requests import get_request_body_property, get_user_email
from .responses import *
from api.application.tasks_list_service import TasksListService
from api._app import add_app_url


class TasksListHandlerForGroups(MethodView):
    init_every_request = False
    decorators = [requires_auth]

    @staticmethod
    def route():
        return "/tasks-lists"

    @staticmethod
    def name():
        return "tasks_list_handler_for_groups"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def get(self):
        return success_response(
            self.tasks_list_service.get_all(get_user_email(request))
        )

    def post(self):
        tasks_list = self.tasks_list_service.add(
            get_request_body_property(request, "name"), get_user_email(request)
        )
        return created_response(tasks_list)


class TasksListHandlerForItems(MethodView):
    init_every_request = False
    decorators = [requires_auth]

    @staticmethod
    def route():
        return "/tasks-lists/<id>"

    @staticmethod
    def name():
        return "tasks_list_handler_for_items"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def get(self, id):
        tasks_list = self.tasks_list_service.get_by_id(id, get_user_email(request))
        if tasks_list is None:
            return not_found_response("Tasks list not found")
        return success_response(tasks_list)

    def patch(self, id):
        self.tasks_list_service.update(
            id, get_user_email(request), get_request_body_property(request, "name")
        )
        return no_content_response()

    def delete(self, id):
        self.tasks_list_service.delete(id, get_user_email(request))
        return no_content_response()


class UpdateLastSelectedTimeHandler(MethodView):
    init_every_request = False
    decorators = [requires_auth]

    @staticmethod
    def route():
        return "/tasks-lists/<id>/last-selected-time"

    @staticmethod
    def name():
        return "update_last_selected_time_handler"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def patch(self, id):
        self.tasks_list_service.update_last_selected_time(id, get_user_email(request))
        return no_content_response()


class ShareTasksListHandler(MethodView):
    init_every_request = False
    decorators = [requires_auth]

    @staticmethod
    def route():
        return "/tasks-lists/<id>/share"

    @staticmethod
    def name():
        return "share_tasks_list_handler"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def patch(self, id):
        self.tasks_list_service.share(
            id,
            get_user_email(request),
            get_request_body_property(request, "share_with"),
        )
        return no_content_response()


class UnshareTasksListHandler(MethodView):
    init_every_request = False
    decorators = [requires_auth]

    @staticmethod
    def route():
        return "/tasks-lists/<id>/unshare"

    @staticmethod
    def name():
        return "unshare_tasks_list_handler"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def patch(self, id):
        self.tasks_list_service.unshare(
            id,
            get_user_email(request),
            get_request_body_property(request, "unshare_with"),
        )
        return no_content_response()


class UnshareSelfTasksListHandler(MethodView):
    init_every_request = False
    decorators = [requires_auth]

    @staticmethod
    def route():
        return "/tasks-lists/<id>/unshare-self"

    @staticmethod
    def name():
        return "unshare_self_tasks_list_handler"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def patch(self, id):
        self.tasks_list_service.unshare_self(id, get_user_email(request))
        return no_content_response()


class AddTasksHandler(MethodView):
    init_every_request = False
    decorators = [requires_auth]

    @staticmethod
    def route():
        return "/tasks-lists/<tasks_list_id>/task"

    @staticmethod
    def name():
        return "add_task_handler"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def post(self, tasks_list_id):
        task_id = self.tasks_list_service.add_task(
            tasks_list_id,
            get_user_email(request),
            get_request_body_property(request, "content"),
        )
        return created_response({"id": task_id})


class TickTaskHandler(MethodView):
    init_every_request = False
    decorators = [requires_auth]

    @staticmethod
    def route():
        return "/tasks-lists/<tasks_list_id>/task/<task_id>/tick"

    @staticmethod
    def name():
        return "tick_task_handler"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def patch(self, tasks_list_id, task_id):
        self.tasks_list_service.tick_task(
            tasks_list_id,
            get_user_email(request),
            task_id,
        )
        return no_content_response()


class RemoveTaskHandler(MethodView):
    init_every_request = False
    decorators = [requires_auth]

    @staticmethod
    def route():
        return "/tasks-lists/<tasks_list_id>/task/<task_id>/remove"

    @staticmethod
    def name():
        return "remove_task_handler"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def patch(self, tasks_list_id, task_id):
        self.tasks_list_service.remove_task(
            tasks_list_id, get_user_email(request), task_id
        )
        return no_content_response()


class CarryTaskHandler(MethodView):
    init_every_request = False
    decorators = [requires_auth]

    @staticmethod
    def route():
        return "/tasks-lists/<tasks_list_id>/task/<task_id>/carry"

    @staticmethod
    def name():
        return "carry_task_handler"

    def __init__(self, tasks_list_service: TasksListService):
        self.tasks_list_service = tasks_list_service

    def patch(self, tasks_list_id, task_id):
        self.tasks_list_service.carry_task(
            tasks_list_id, get_user_email(request), task_id
        )
        return no_content_response()


def register_task_handlers(app, tasks_list_service):
    tasks_list_handler_for_groups = TasksListHandlerForGroups.as_view(
        TasksListHandlerForGroups.name(), tasks_list_service
    )
    tasks_list_handler_for_items = TasksListHandlerForItems.as_view(
        TasksListHandlerForItems.name(), tasks_list_service
    )
    update_last_selected_time_handler = UpdateLastSelectedTimeHandler.as_view(
        UpdateLastSelectedTimeHandler.name(), tasks_list_service
    )
    share_tasks_list_handler = ShareTasksListHandler.as_view(
        ShareTasksListHandler.name(), tasks_list_service
    )
    unshare_tasks_list_handler = UnshareTasksListHandler.as_view(
        UnshareTasksListHandler.name(), tasks_list_service
    )
    unshare_self_tasks_list_handler = UnshareSelfTasksListHandler.as_view(
        UnshareSelfTasksListHandler.name(), tasks_list_service
    )
    add_tasks_handler = AddTasksHandler.as_view(
        AddTasksHandler.name(), tasks_list_service
    )
    tick_task_handler = TickTaskHandler.as_view(
        TickTaskHandler.name(), tasks_list_service
    )
    remove_task_handler = RemoveTaskHandler.as_view(
        RemoveTaskHandler.name(), tasks_list_service
    )
    carry_task_handler = CarryTaskHandler.as_view(
        CarryTaskHandler.name(), tasks_list_service
    )

    add_app_url(app, TasksListHandlerForGroups.route(), tasks_list_handler_for_groups)
    add_app_url(app, TasksListHandlerForItems.route(), tasks_list_handler_for_items)
    add_app_url(
        app, UpdateLastSelectedTimeHandler.route(), update_last_selected_time_handler
    )
    add_app_url(app, ShareTasksListHandler.route(), share_tasks_list_handler)
    add_app_url(app, UnshareTasksListHandler.route(), unshare_tasks_list_handler)
    add_app_url(
        app, UnshareSelfTasksListHandler.route(), unshare_self_tasks_list_handler
    )
    add_app_url(app, AddTasksHandler.route(), add_tasks_handler)
    add_app_url(app, TickTaskHandler.route(), tick_task_handler)
    add_app_url(app, RemoveTaskHandler.route(), remove_task_handler)
    add_app_url(app, CarryTaskHandler.route(), carry_task_handler)
    return app
