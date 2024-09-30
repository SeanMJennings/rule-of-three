from flask import Response
import http
import json


def success_response(item: dict) -> Response:
    return Response(response=json.dumps(item.__dict__), status=http.client.OK)


def created_response(id) -> Response:
    return Response(response=json.dumps(id), status=http.client.CREATED)


def not_found_response(error: str) -> Response:
    return Response(
        response=json.dumps({"error": error}),
        status=http.client.NOT_FOUND,
    )


def no_content_response() -> Response:
    return Response(status=http.client.NO_CONTENT)
