from flask import jsonify
from api.application.validation_exception import ValidationException
from api.handlers.auth_zero_decorators import AuthError
from http import HTTPStatus


def handle_exception(err):
    if type(err) is ValidationException:
        return jsonify({"error": " ".join(err.args)}), HTTPStatus.UNPROCESSABLE_ENTITY
    if type(err) is AuthError:
        return jsonify({"error": " ".join(err.args)}), HTTPStatus.UNAUTHORIZED
    else:
        response = {"error": "Internal server error"}
    return jsonify(response), HTTPStatus.INTERNAL_SERVER_ERROR
