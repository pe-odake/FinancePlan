from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import SessionLocal, get_db
from schemas.auth import LoginRequest, LoginResponse, RegisterRequest
from passlib.context import CryptContext
import bcrypt as _bcrypt_lib

_orig_hashpw = _bcrypt_lib.hashpw

def _hashpw_truncate(secret, salt):
    if isinstance(secret, str):
        secret = secret.encode("utf-8")
    if len(secret) > 72:
        secret = secret[:72]
    return _orig_hashpw(secret, salt)

_bcrypt_lib.hashpw = _hashpw_truncate

from models.user import DimUser

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Buscar usuário pelo email
    result_user = await db.execute(select(DimUser).where(DimUser.email == request.email))
    user = result_user.scalars().first()

    # Verificar se usuário existe e senha está correta
    if not user or not pwd_context.verify(request.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")

    return LoginResponse(
        user_id=user.user_id,
        nome=user.nome,
        email=user.email,
    )


@router.post("/register", response_model=LoginResponse)
async def register_user(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # 1. Verificar se o e-mail já existe
    query = select(DimUser).where(DimUser.email == data.email)
    result = await db.execute(query)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email já registrado.")

    # 2. Criar novo usuário com senha criptografada
    hashed_password = pwd_context.hash(data.password)
    new_user = DimUser(
        nome=data.nome,
        email=data.email,
        password=hashed_password,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return LoginResponse(
        user_id=new_user.user_id,
        nome=new_user.nome,
        email=new_user.email
    )