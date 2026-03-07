from fastapi import APIRouter

from .endpoints.user_get import router as user_get_router
from .endpoints.user_post import router as user_post_router
# from .endpoints.user_info_get import router as user_info_router
# from .endpoints.recommendation_get import router as recommendation_get_router
from .endpoints.recommendation_post import router as recommendation_post_router
# from .endpoints.reaction_post import router as reaction_router
from .endpoints.store_get import router as store_router

router = APIRouter()

router.include_router(user_get_router, prefix="/user", tags=["user"])
router.include_router(user_post_router, prefix="/user", tags=["user"])
# router.include_router(user_info_router, prefix="/user_info", tags=["user"])
# router.include_router(recommendation_get_router, prefix="/recommendation", tags=["recommendation"])
router.include_router(recommendation_post_router, prefix="/recommendation", tags=["recommendation"])
# router.include_router(reaction_router, prefix="/reaction", tags=["reaction"])

router.include_router(store_router, prefix="/store", tags=["store"])