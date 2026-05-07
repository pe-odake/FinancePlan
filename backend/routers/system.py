from fastapi import APIRouter
from datetime import datetime

router = APIRouter(
    prefix="/system",
    tags=["system"]
)

@router.get("/")
def root():
    return {"message": "API online"}

@router.get("/health")
def health():
    return {
        "status": "online",
        "timestamp": datetime.now()
    }