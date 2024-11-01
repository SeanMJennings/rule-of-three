import json
from jwcrypto import jwk, jwt

kid = "12345"
rs256_algorithm = "RS256"
hs256_algorithm = "HS256"
rs256_key = jwk.JWK.generate(
    kty="RSA", size=2048, alg=rs256_algorithm, use="sig", kid=kid
)
hs256_key = jwk.JWK.generate(kty="oct", size=256, alg=hs256_algorithm, use="sig")
public_key = rs256_key.export_public()
private_key = rs256_key.export_private()
issuer = "https://wibblewobble.uk.auth0.com/"
different_issuer = "https://wobble.uk.auth0.com/"
audience = issuer + "api/v2/"
well_known_jwks_json = {"keys": [json.loads(public_key)]}


def get_jwks():
    return well_known_jwks_json


def get_jwks_with_wrong_key_id():
    the_json = json.loads(public_key)
    the_json["kid"] = "54321"
    return {"keys": [the_json]}


def valid_payload():
    return {
        "iss": issuer,
        "sub": "BvwjAUeDP0Y0EERDlJvs6JJHxPQsbRUw@clients",
        "aud": audience,
        "iat": 1730377646,
        "exp": 4070908800,  # expires in 2099
        "gty": "client-credentials",
        "azp": "BvwjAUeEQSY0QGlDlJvs6JJHxPQsbRUw",
    }


def expired_payload():
    return {
        "iss": issuer,
        "sub": "BvwjAUeDP0Y0EERDlJvs6JJHxPQsbRUw@clients",
        "aud": audience,
        "iat": 1730377646,
        "exp": 1730377647,  # expired
        "gty": "client-credentials",
        "azp": "BvwjAUeEQSY0QGlDlJvs6JJHxPQsbRUw",
    }


def different_issuer_payload():
    return {
        "iss": different_issuer,
        "sub": "BvwjAUeDP0Y0EERDlJvs6JJHxPQsbRUw@clients",
        "aud": audience,
        "iat": 1730377646,
        "exp": 4070908800,
        "gty": "client-credentials",
        "azp": "BvwjAUeEQSY0QGlDlJvs6JJHxPQsbRUw",
    }


def the_public_key():
    return public_key


def rs256_token(payload):
    jwt_token = jwt.JWT(
        header={
            "alg": rs256_algorithm,
            "kid": kid,
        },
        claims=payload,
    )
    jwt_token.make_signed_token(rs256_key)
    return jwt_token.serialize()


def hs256_token(payload):
    jwt_token = jwt.JWT(
        header={
            "alg": hs256_algorithm,
            "kid": kid,
        },
        claims=payload,
    )
    jwt_token.make_signed_token(hs256_key)
    return jwt_token.serialize()
