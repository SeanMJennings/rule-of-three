from src.handlers.tasks_list_handlers import register_handlers
from flask import Flask


def create_app(tasks_list_service):
    app = Flask(__name__)
    register_handlers(app, tasks_list_service)
    return app
