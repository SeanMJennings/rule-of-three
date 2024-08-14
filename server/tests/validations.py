from uuid import UUID


def validate_uuid4(the_uuid):

    try:
        UUID(the_uuid, version=4)
    except ValueError:
        return False

    return True
