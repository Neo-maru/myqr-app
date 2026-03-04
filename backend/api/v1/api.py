from fastapi import APIRouter
from api.v1.endpoints.user import router as login_router

router = APIRouter()

# 以下のような形で作成してください（URLに/loginが付いていたら、endpointsのuser.pyを実行する）
router.include_router(login_router, prefix="/login", tags=["login"])