import pytest
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token

def test_password_hashing():
    pwd = "MySecretPassword123!"
    hashed = hash_password(pwd)
    assert hashed != pwd
    assert verify_password(pwd, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_flow():
    user_data = {"sub": "user-12345", "email": "test@example.com"}
    token = create_access_token(user_data)
    assert token is not None
    
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "user-12345"
    assert decoded["email"] == "test@example.com"
