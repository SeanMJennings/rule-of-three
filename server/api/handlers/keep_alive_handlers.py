from flask.views import MethodView

from .responses import *
from .._app import add_app_url


class KeepAliveHandler(MethodView):
    init_every_request = False

    @staticmethod
    def route():
        return "/keep-alive"

    @staticmethod
    def name():
        return "keep_alive_handler"

    @staticmethod
    def get():
        return success_response(None)


def register_keep_alive_handlers(app):
    keep_alive_handler = KeepAliveHandler.as_view(
        KeepAliveHandler.name()
    )

    add_app_url(app, KeepAliveHandler.route(), keep_alive_handler)
    return app
