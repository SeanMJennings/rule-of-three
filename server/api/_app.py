# routePrefix in host.json does not work, so this is used instead
def add_app_url(app, route, handler):
    app.add_url_rule(
        "/api" + route,
        view_func=handler,
    )
    return app
