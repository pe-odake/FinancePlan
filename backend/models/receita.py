from sqlalchemy import String, Float, Date, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base
from models.user import DimUser
from datetime import date

class DimReceita(Base):
    __tablename__ = "dimreceita"  

    receita_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("dimuser.user_id", ondelete="CASCADE"), nullable=False)
    nome_receita: Mapped[str] = mapped_column(String(255), nullable=False)
    valor_receita: Mapped[float] = mapped_column(Numeric(precision=10, scale=2), nullable=False)
    data_receita: Mapped[date] = mapped_column(Date, nullable=False)