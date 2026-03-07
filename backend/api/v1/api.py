from fastapi import APIRouter

from .endpoints.user_get import router as user_get_router
from .endpoints.user_post import router as user_post_router
from .endpoints.user_info_get import router as user_info_router
from .endpoints.recommendation_get import router as recommendation_get_router
from .endpoints.recommendation_post import router as recommendation_post_router
from .endpoints.reaction_post import router as reaction_router
from .endpoints.store_get import router as store_router

router = APIRouter()

# ユーザー情報取得
# POST /user/get
router.include_router(user_get_router, prefix="/user", tags=["user"])

# ユーザー新規登録 / 更新
# POST /user/post
router.include_router(user_post_router, prefix="/user", tags=["user"])

# 店舗側ユーザー情報取得
# GET /user_info/{qr_id}
router.include_router(user_info_router, prefix="/user_info", tags=["user"])

# おすすめ商品取得
# POST /recommendation/get
router.include_router(recommendation_get_router, prefix="/recommendation", tags=["recommendation"])

# おすすめ商品登録
# POST /recommendation/post
router.include_router(recommendation_post_router, prefix="/recommendation", tags=["recommendation"])

# リアクション登録
# POST /reaction/post
router.include_router(reaction_router, prefix="/reaction", tags=["reaction"])

# 店舗情報取得
# GET /store/get
router.include_router(store_router, prefix="/store", tags=["store"])