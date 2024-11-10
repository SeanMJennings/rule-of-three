from src.application.tasks_list_service import TasksListService
from src.persistence.initialise_cosmos import container
from src.app import create_app
from src.cache import cache, cache_config
import azure.functions as func


tasks_list_service = TasksListService(container)
app = create_app(tasks_list_service)
cache.init_app(app, config=cache_config)

main = func.WsgiMiddleware(app.wsgi_app).main
