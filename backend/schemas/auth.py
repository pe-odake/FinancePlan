from pydantic import BaseModel, EmailStr, Field
from datetime import date

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=72)

class LoginResponse(BaseModel):
    user_id: int
    nome: str
    email: str

class RegisterRequest(BaseModel):
    nome: str
    email: EmailStr
    password: str = Field(..., max_length=72)