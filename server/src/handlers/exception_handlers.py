from flask import jsonify
from src.application.validation_exception import ValidationException
import http

from src.handlers.auth_zero_decorators import AuthError


def handle_exception(err):
    if type(err) is ValidationException:
        return jsonify({"error": " ".join(err.args)}), http.client.UNPROCESSABLE_ENTITY
    if type(err) is AuthError:
        return jsonify({"error": " ".join(err.args)}), http.client.UNAUTHORIZED
    else:
        response = {"error": "Internal server error"}
    return jsonify(response), http.client.INTERNAL_SERVER_ERROR
