def get_request_body_property(request, name):
    return request.get_json(silent=True)[name]


def get_user_id(request):
    return request.current_user["sub"]


CUSTOM_AUTHORIZATION_HEADER_KEY = "X-Custom-Authorization"
