from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.session import get_db
from models.all_models import Recommendation
from schemas import RecommendationPostRequest, RecommendationPostResponse

from api.v1.utils.log_utils import log_debug
from api.v1.utils.db_utils import get_recommendation

router = APIRouter()


@router.post("/recommendation/post", response_model=RecommendationPostResponse)
def recommendation_post(req: RecommendationPostRequest, db: Session = Depends(get_db)):
    existing = get_recommendation(db, req.user_id, req.product_id, req.store_id)
    if existing:
        log_debug("recommendation delete", {
            "user_id": req.user_id,
            "product_id": req.product_id,
            "store_id": req.store_id
        })
        db.delete(existing)
        db.commit()
        return RecommendationPostResponse(status="deleted")

    if not existing:
        log_debug("recommendation register", {
            "user_id": req.user_id,
            "product_id": req.product_id,
            "store_id": req.store_id
        })

        recommendation = Recommendation(
            user_id=req.user_id,
            product_id=req.product_id,
            store_id=req.store_id,
            reaction=None,
        )

        db.add(recommendation)
        db.commit()
    return RecommendationPostResponse(status="ok")
