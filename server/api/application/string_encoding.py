import base64


def encode_string(value: str) -> str:
    value_bytes = value.encode("ascii")
    return base64.b64encode(value_bytes).decode("ascii")


def decode_string(value: str) -> str:
    value_bytes = base64.b64decode(value.encode("ascii"))
    return value_bytes.decode("ascii")