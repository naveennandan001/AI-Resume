from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.models.domain import User
from app.schemas.pydantic_models import UserCreate, UserLogin, UserResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    """Dependency to get authenticated current user."""
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload["sub"]
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/register", response_model=TokenResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hash_password(user_in.password)
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    token = create_access_token({"sub": user.id, "email": user.email})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))

@router.post("/login", response_model=TokenResponse)
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user_in.email))
    user = result.scalars().first()
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    token = create_access_token({"sub": user.id, "email": user.email})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))

@router.post("/demo-login", response_model=TokenResponse)
async def demo_login(db: AsyncSession = Depends(get_db)):
    """One-click demo login for hackathon judges."""
    demo_email = "demo.alex@careercoach.ai"
    result = await db.execute(select(User).filter(User.email == demo_email))
    user = result.scalars().first()
    
    if not user:
        user = User(
            name="Alex Chen",
            email=demo_email,
            password_hash=hash_password("demopassword123")
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    
    token = create_access_token({"sub": user.id, "email": user.email})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
