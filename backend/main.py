from fastapi import FastAPI
from core.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from routers import user, auth, despesa, receita, categoria

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(auth.router)
# app.include_router(produtos.router, prefix="/api")
app.include_router(user.router)
app.include_router(despesa.router)
app.include_router(receita.router)
app.include_router(categoria.router)