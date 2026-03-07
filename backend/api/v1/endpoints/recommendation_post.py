from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from schemas import RecommendationPostRequest, RecommendationPostResponse
from db.session import get_db
from api.v1.utils.db_utils import get_store
from api.v1.utils.business_logic import error_response, get_recommendation
from api.v1.utils.log_utils import log_debug
from models.all_models import Recommendation

router = APIRouter()


@router.post("/recommendation/post", response_model=RecommendationPostResponse)
def recommendation_post(req: RecommendationPostRequest, db: Session = Depends(get_db)):
    log_debug("recommendation_post", req.dict())

    recommendation = get_recommendation(req.user_id, req.product_id, req.store_id)

    if recommendation:
        db.delete(recommendation)
        db.commit()
        return RecommendationPostResponse(status="deleted")

    recommendation = Recommendation(
        user_id=req.user_id,
        product_id=req.product_id,
        store_id=req.store.id,
        reaction=None,
    )
    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)

    return RecommendationPostResponse(status="created")
