from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import get_db
from typing import List

from models.categoria import DimCategoria
from schemas.categoria import CategoriaResponse, CategoriaCreate

router = APIRouter(prefix="/categorias", tags=["Categorias"])

@router.get("/", response_model=List[CategoriaResponse])
async def listar_categorias(db: AsyncSession = Depends(get_db)):
    query = select(DimCategoria)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
async def criar_categoria(categoria: CategoriaCreate, db: AsyncSession = Depends(get_db)):
    
    nova_categoria = DimCategoria(**categoria.model_dump())
    
    try:
        
        db.add(nova_categoria)
        await db.commit()
        await db.refresh(nova_categoria)
        
        return nova_categoria
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao salvar categoria: {str(e)}"
        )