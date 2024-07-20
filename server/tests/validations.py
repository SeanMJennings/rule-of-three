from uuid import UUID


def validate_uuid4(the_uuid):

    try:
        val = UUID(the_uuid.hex, version=4)
    except ValueError:
        return False

    return val.hex == the_uuid.hex
