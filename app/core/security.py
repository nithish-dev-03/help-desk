from pwdlib import PasswordHash
from jwt import encode as jwt_encode, decode as jwt_decode

password_hash = PasswordHash.recommended()

hash_password = lambda password:password_hash.hash(password)
verify_password = lambda plain_pass,hashed_pass:password_hash.verify(plain_pass,hashed_pass)

def decode(payload,secret,alg):
    return jwt_decode(payload,secret,alg)

def encode(payload,secret,alg):
    return jwt_encode(payload,secret,alg)