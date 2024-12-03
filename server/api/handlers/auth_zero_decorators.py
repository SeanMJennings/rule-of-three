# Taken from https://github.com/auth0-samples/auth0-python-api-samples/blob/master/00-Starter-Seed/server.py
from functools import wraps
import json
from typing import Dict
from urllib.request import urlopen

from flask import request
from api.cache import cache
from jose import jwt
from pathlib import Path
import yaml

from api.handlers.requests import (
    AUTHORIZATION_HEADER_KEY,
)

path = Path(__file__).parent / "../config.yaml"
config = yaml.safe_load(open(path))

AUTH0_DOMAIN = config["AUTH0_DOMAIN"]
AUTH0_API_IDENTIFIER = config["AUTH0_API_IDENTIFIER"]
ALGORITHMS = ["RS256"]


class AuthError(Exception):
    def __init__(self, message):
        super().__init__(message)


def get_token_auth_header() -> str:
    auth = request.headers.get(AUTHORIZATION_HEADER_KEY, None)
    if not auth:
        raise AuthError(AUTHORIZATION_HEADER_KEY + " header is expected")

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError(AUTHORIZATION_HEADER_KEY + " header must start with: Bearer")
    if len(parts) == 1:
        raise AuthError("Token not found")
    if len(parts) > 2:
        raise AuthError(AUTHORIZATION_HEADER_KEY + " header must be: Bearer token")

    token = parts[1]
    return token


def get_jwks() -> Dict[str, str]:
    jsonurl = urlopen("https://" + AUTH0_DOMAIN + "/.well-known/jwks.json")
    return json.loads(jsonurl.read())


def get_jwks_from_cache() -> Dict[str, str]:
    jwks = cache.get("jwks")
    if jwks is None:
        jwks = get_jwks()
        cache.set("jwks", jwks)
    return jwks


def requires_scope(required_scope: str) -> bool:
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)
    if unverified_claims.get("scope"):
        token_scopes = unverified_claims["scope"].split()
        for token_scope in token_scopes:
            if token_scope == required_scope:
                return True
    return False


def requires_auth(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jwks = get_jwks_from_cache()
        try:
            unverified_header = jwt.get_unverified_header(token)
        except jwt.JWTError as jwt_error:
            raise AuthError(
                "Invalid header. Use an RS256 signed JWT Access Token"
            ) from jwt_error
        if unverified_header["alg"] == "HS256":
            raise AuthError(
                "HS256 is invalid header algorithm. Use an RS256 signed JWT Access Token"
            )
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=AUTH0_API_IDENTIFIER,
                    issuer="https://" + AUTH0_DOMAIN + "/",
                )
            except jwt.ExpiredSignatureError as expired_sign_error:
                raise AuthError("Token is expired") from expired_sign_error
            except jwt.JWTClaimsError as jwt_claims_error:
                raise AuthError(
                    "Incorrect claims, please check the audience and issuer"
                ) from jwt_claims_error
            except Exception as exc:
                raise AuthError("Unable to parse authentication token.") from exc

            request.current_user = payload
            return func(*args, **kwargs)
        raise AuthError("Unable to find appropriate key")

    return decorated
