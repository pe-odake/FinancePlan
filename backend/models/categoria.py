from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base
from models.user import DimUser
from datetime import date

class DimCategoria(Base):
    __tablename__ = "dimcategoria"  

    categoria_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nome_categoria: Mapped[str] = mapped_column(String(255), nullable=False)
    essencial: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)