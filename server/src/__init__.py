from src.application.notes_list_service import NotesListService
from src.persistence.initialise_cosmos import container
from src.app import create_app
import azure.functions as func


notes_list_service = NotesListService(container)
app = create_app(notes_list_service)

main = func.WsgiMiddleware(app.wsgi_app).main
