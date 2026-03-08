from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.session import get_db
from schemas import ReactionPostRequest, ReactionPostResponse
from api.v1.utils.db_utils import get_recommendation
from api.v1.utils.log_utils import log_debug
from api.v1.utils.business_logic import error_response

router = APIRouter()

@router.post("/reaction/post", response_model=ReactionPostResponse)
def reaction_post(request: ReactionPostRequest, db: Session = Depends(get_db)):
    log_debug("reaction_post request", request)
    existing = get_recommendation(
        db,
        request.user_id,
        request.product_id,
        request.store_id
    )

    if existing:
        log_debug("reaction_post", "update recommendations")
        existing.reaction = request.reaction
        db.commit()
        db.refresh(existing)

    else:
        log_debug("reaction_post error", "Recommendation not found")
        return error_response(404, "Recommendation not found")

    return ReactionPostResponse(status="ok")