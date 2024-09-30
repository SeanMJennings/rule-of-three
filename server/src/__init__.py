from src.application.tasks_list_service import TasksListService
from src.persistence.initialise_cosmos import container
from src.app import create_app
import azure.functions as func


tasks_list_service = TasksListService(container)
app = create_app(tasks_list_service)

main = func.WsgiMiddleware(app.wsgi_app).main
