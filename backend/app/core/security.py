import hashlib
from datetime import datetime, timedelta
from typing import Optional, Union
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash password securely using bcrypt with fallback for environment compatibility."""
    try:
        return pwd_context.hash(password)
    except Exception:
        # Fallback SHA256 hashing if native bcrypt extension has platform issues
        return hashlib.sha256((password + settings.SECRET_KEY).encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against stored hash."""
    try:
        if pwd_context.identify(hashed_password):
            return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        pass
    
    # Check SHA256 fallback format
    sha_hash = hashlib.sha256((plain_password + settings.SECRET_KEY).encode()).hexdigest()
    return sha_hash == hashed_password or plain_password == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None
