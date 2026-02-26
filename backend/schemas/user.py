from pydantic import BaseModel
from typing import Optional

class UserResponse(BaseModel):
    user_id: int
    nome: str
    email: str