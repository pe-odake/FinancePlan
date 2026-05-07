from fastapi import FastAPI
from core.database import engine, Base, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from routers import user, auth, despesa, receita, categoria, investimentos, system
from sqlalchemy import select
from models.categoria import DimCategoria

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           
    allow_methods=["*"],
    allow_headers=["*"],
)

CATEGORIAS_PADRAO = [
    {"nome_categoria": "Alimentação", "essencial": True},
    {"nome_categoria": "Transporte", "essencial": True},
    {"nome_categoria": "Moradia", "essencial": True},
    {"nome_categoria": "Saúde", "essencial": True},
    {"nome_categoria": "Educação", "essencial": True},
    {"nome_categoria": "Lazer", "essencial": False},
    {"nome_categoria": "Vestuário", "essencial": False},
    {"nome_categoria": "Contas", "essencial": True},
    {"nome_categoria": "Salário", "essencial": False},
    {"nome_categoria": "Freelance", "essencial": False},
    {"nome_categoria": "Investimentos", "essencial": False},
    {"nome_categoria": "Outros", "essencial": False},
]

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed de categorias padrão
    async with SessionLocal() as session:
        result = await session.execute(select(DimCategoria))
        existentes = result.scalars().all()

        if not existentes:
            for cat_data in CATEGORIAS_PADRAO:
                cat = DimCategoria(**cat_data)
                session.add(cat)
            await session.commit()

app.include_router(auth.router)
app.include_router(system.router)
app.include_router(user.router)
app.include_router(despesa.router)
app.include_router(receita.router)
app.include_router(categoria.router)
app.include_router(investimentos.router)