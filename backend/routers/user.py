from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import get_db
from typing import List
from models.user import DimUser
from schemas.user import UserResponse

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
async def listar_users(db: AsyncSession = Depends(get_db)):
    query = select(DimUser)
    result = await db.execute(query)
    rows = result.scalars().all()
    return rows
