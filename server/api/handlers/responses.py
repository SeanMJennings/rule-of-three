from flask import Response
from http import HTTPStatus
import json


def success_response(item) -> Response:
    if isinstance(item, list):
        return Response(
            response=json.dumps([i.to_dict() for i in item]), status=HTTPStatus.OK
        )
    if item is None:
        return Response(status=HTTPStatus.OK)
    return Response(response=json.dumps(item.to_dict()), status=HTTPStatus.OK)


def created_response(id) -> Response:
    if id is None:
        return Response(status=HTTPStatus.CREATED)
    return Response(response=json.dumps(id), status=HTTPStatus.CREATED)


def not_found_response(error: str) -> Response:
    return Response(
        response=json.dumps({"error": error}),
        status=HTTPStatus.NOT_FOUND,
    )


def no_content_response() -> Response:
    return Response(status=HTTPStatus.NO_CONTENT)
