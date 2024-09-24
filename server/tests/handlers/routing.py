def notes_url():
    return "http://localhost:5000/notes"


def notes_url_with_id(id):
    return f"{notes_url()}/{id}"
