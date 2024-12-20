from api.application.tasks_list_service import TasksListService
from api.persistence.initialise_cosmos import tasks_lists_container
from api.app import create_app
from api.cache import cache, cache_config
import azure.functions as func


tasks_list_service = TasksListService(tasks_lists_container)
app = create_app(tasks_list_service)
cache.init_app(app, config=cache_config)

main = func.WsgiMiddleware(app.wsgi_app).main
