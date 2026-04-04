from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import get_db
from typing import List

from models.despesa import DimDespesa
from schemas.despesa import DespesaResponse, DespesaCreate

router = APIRouter(prefix="/despesas", tags=["Despesas"])

@router.get("/", response_model=List[DespesaResponse])
async def listar_despesas(db: AsyncSession = Depends(get_db)):
    query = select(DimDespesa)
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