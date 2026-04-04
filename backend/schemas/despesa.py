from pydantic import BaseModel
from datetime import date

class DespesaBase(BaseModel): # modelo usando nos outros schemas de despesa
    user_id: int
    categoria_id: int
    nome_despesa: str
    valor_despesa: float
    data_despesa: date

class DespesaCreate(DespesaBase): # POST
    pass  

class DespesaResponse(DespesaBase): # GET
    despesa_id: int

    class Config:
        from_attributes = True #