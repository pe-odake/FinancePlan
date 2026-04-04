from pydantic import BaseModel
from datetime import date

class CategoriaBase(BaseModel): # modelo usando nos outros schemas de categoria
    nome_categoria: str
    essencial: bool

class CategoriaCreate(CategoriaBase): # POST
    pass  

class CategoriaResponse(CategoriaBase): # GET
    categoria_id: int

    class Config:
        from_attributes = True #