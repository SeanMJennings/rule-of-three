from src.handlers.tasks_list_handlers import register_handlers
from flask import Flask
from src.handlers.exception_handlers import handle_exception


def create_app(tasks_list_service):
    app = Flask(__name__)
    register_handlers(app, tasks_list_service)
    app.errorhandler(Exception)(handle_exception)
    return app
