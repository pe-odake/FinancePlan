from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
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

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_usuario(user_id: int, db: AsyncSession = Depends(get_db)):
    # Verificar se o usuário existe
    query = select(DimUser).where(DimUser.user_id == user_id)
    result = await db.execute(query)
    usuario = result.scalars().first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Deletar o usuário
    delete_query = delete(DimUser).where(DimUser.user_id == user_id)
    await db.execute(delete_query)
    await db.commit()
    
    return None
