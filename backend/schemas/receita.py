from pydantic import BaseModel
from datetime import date

class ReceitaBase(BaseModel): # modelo usando nos outros schemas de receita
    user_id: int
    nome_receita: str
    valor_receita: float
    data_receita: date

class ReceitaCreate(ReceitaBase): # POST
    pass  

class ReceitaResponse(ReceitaBase): # GET
    receita_id: int

    class Config:
        from_attributes = True #