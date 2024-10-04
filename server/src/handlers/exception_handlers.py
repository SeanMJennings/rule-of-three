from flask import jsonify
from src.application.validation_exception import ValidationException
import http


def handle_exception(err):
    if type(err) is ValidationException:
        response = {"error": err.args[0]}
    else:
        response = {"error": "Internal server error"}
    return jsonify(response), http.client.INTERNAL_SERVER_ERROR
