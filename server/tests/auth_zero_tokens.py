import jwt
from jwcrypto import jwk


key = jwk.JWK.generate(kty="RSA", size=2048, alg="RSA-OAEP-256", use="sig", kid="12345")
public_key = key.export_public()
private_key = key.export_private()
issuer = "https://wibblewobble.uk.auth0.com/"
audience = issuer + "api/v2/"
algorithm = "RS256"
well_known_jwks_json = {"keys": [public_key]}


def get_jwks():
    return well_known_jwks_json


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


def the_public_key():
    return public_key


def token(payload):
    return jwt.encode(payload, private_key, algorithm=algorithm)


def the_payload(the_token):
    return jwt.decode(
        the_token,
        private_key.public_key(),
        algorithms=[audience],
        audience=audience,
    )
