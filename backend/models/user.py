from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base
class DimUser(Base):
    __tablename__ = "dimuser"  

    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email:     Mapped[str] = mapped_column(String(255), nullable=False)
    password:     Mapped[str] = mapped_column(String(255), nullable=False)
    nome:      Mapped[str] = mapped_column(String(255), nullable=False)