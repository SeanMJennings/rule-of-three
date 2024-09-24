def get_request_body_property(request, name):
    return request.get_json(silent=True)[name]
