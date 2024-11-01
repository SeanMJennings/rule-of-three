from flask import Response
import http
import json


def success_response(item) -> Response:
    if isinstance(item, list):
        return Response(
            response=json.dumps([i.to_dict() for i in item]), status=http.client.OK
        )
    if item is None:
        return Response(status=http.client.OK)
    return Response(response=json.dumps(item.to_dict()), status=http.client.OK)


def created_response(id) -> Response:
    if id is None:
        return Response(status=http.client.CREATED)
    return Response(response=json.dumps(id), status=http.client.CREATED)


def not_found_response(error: str) -> Response:
    return Response(
        response=json.dumps({"error": error}),
        status=http.client.NOT_FOUND,
    )


def no_content_response() -> Response:
    return Response(status=http.client.NO_CONTENT)
