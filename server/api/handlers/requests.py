def get_request_body_property(request, name):
    return request.get_json(silent=True)[name]


def get_user_email(request):
    return request.current_user["email"]


AUTHORIZATION_HEADER_KEY = "Authorization"
