from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import get_db
from typing import List

from models.despesa import DimDespesa
from schemas.despesa import DespesaResponse, DespesaCreate

router = APIRouter(prefix="/despesas", tags=["Despesas"])

@router.get("/", response_model=List[DespesaResponse])
async def listar_despesas(user_id: int = Query(...), db: AsyncSession = Depends(get_db)):
    query = select(DimDespesa).where(DimDespesa.user_id == user_id)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=DespesaResponse, status_code=status.HTTP_201_CREATED)
async def criar_despesa(despesa: DespesaCreate, db: AsyncSession = Depends(get_db)):
    
    nova_despesa = DimDespesa(**despesa.model_dump())
    
    try:
        
        db.add(nova_despesa)
        await db.commit()
        await db.refresh(nova_despesa)
        
        return nova_despesa
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao salvar despesa: {str(e)}"
        )

@router.delete("/{despesa_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_despesa(despesa_id: int, db: AsyncSession = Depends(get_db)):
    query = select(DimDespesa).where(DimDespesa.despesa_id == despesa_id)
    result = await db.execute(query)
    despesa = result.scalar_one_or_none()

    if not despesa:
        raise HTTPException(status_code=404, detail="Despesa não encontrada")

    await db.delete(despesa)
    await db.commit()