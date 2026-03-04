from fastapi import APIRouter
from api.v1.endpoints.user import router as login_router

router = APIRouter()

router.include_router(login_router, prefix="/login", tags=["login"])