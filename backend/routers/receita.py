from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import get_db
from typing import List

from models.receita import DimReceita
from schemas.receita import ReceitaResponse, ReceitaCreate

router = APIRouter(prefix="/receitas", tags=["Receitas"])

@router.get("/", response_model=List[ReceitaResponse])
async def listar_receitas(user_id: int = Query(...), db: AsyncSession = Depends(get_db)):
    query = select(DimReceita).where(DimReceita.user_id == user_id)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=ReceitaResponse, status_code=status.HTTP_201_CREATED)
async def criar_receita(receita: ReceitaCreate, db: AsyncSession = Depends(get_db)):
    
    nova_receita = DimReceita(**receita.model_dump())
    
    try:
        
        db.add(nova_receita)
        await db.commit()
        await db.refresh(nova_receita)
        
        return nova_receita
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao salvar receita: {str(e)}"
        )

@router.delete("/{receita_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_receita(receita_id: int, db: AsyncSession = Depends(get_db)):
    query = select(DimReceita).where(DimReceita.receita_id == receita_id)
    result = await db.execute(query)
    receita = result.scalar_one_or_none()

    if not receita:
        raise HTTPException(status_code=404, detail="Receita não encontrada")

    await db.delete(receita)
    await db.commit()