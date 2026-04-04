from sqlalchemy import String, Float, Date, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base
from models.user import DimUser
from models.categoria import DimCategoria
from datetime import date

class DimDespesa(Base):
    __tablename__ = "dimdespesa"  

    despesa_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("dimuser.user_id", ondelete="CASCADE"), nullable=False)
    categoria_id: Mapped[int] = mapped_column(ForeignKey("dimcategoria.categoria_id", ondelete="CASCADE"), nullable=False)
    nome_despesa: Mapped[str] = mapped_column(String(255), nullable=False)
    valor_despesa: Mapped[float] = mapped_column(Numeric(precision=10, scale=2), nullable=False)
    data_despesa: Mapped[date] = mapped_column(Date, nullable=False)