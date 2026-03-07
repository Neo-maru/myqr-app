from fastapi import APIRouter

from api.v1.endpoints.user_get import router as user_get_router
from api.v1.endpoints.user_post import router as user_post_router
from backend.api.v1.endpoints.user_info_get import router as user_info_router
from backend.api.v1.endpoints.recommendation_get import router as recommendation_router
from backend.api.v1.endpoints.reaction_post import router as reaction_router
from backend.api.v1.endpoints.store_get import router as store_router
from backend.api.v1.endpoints.recommendation_post import router as recommendation_post_router

router = APIRouter()

# ユーザー情報取得 POST /user/get
router.include_router(user_get_router, prefix="/user", tags=["user_get"])

# ユーザー新規登録/更新 POST /user/post
router.include_router(user_post_router, prefix="/user", tags=["user_post"])

# お客様情報取得 GET /user_info/{qr_id}
router.include_router(user_info_router, prefix="/user_info", tags=["user_info"])

# おすすめ商品の登録 POST /recommendation
router.include_router(recommendation_router, prefix="/recommendation", tags=["recommendation"])

# リアクション登録 POST /reaction
router.include_router(reaction_router, prefix="/reaction", tags=["reaction"])

# 店舗情報取得 GET /store
router.include_router(store_router, prefix="/store", tags=["store"])

# おすすめ商品取得
router.include_router(recommendation_post_router, prefix="/recommendation_info", tags=["recommendation_info"])