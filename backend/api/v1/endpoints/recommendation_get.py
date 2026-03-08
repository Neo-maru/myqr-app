from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from schemas import RecommendationGetRequest, RecommendationGetResponse

from db.session import get_db
from api.v1.utils.db_utils import get_user_by_qr_id, get_types_by_group
from api.v1.utils.log_utils import log_debug
from api.v1.utils.business_logic import error_response

router = APIRouter()

@router.post("/recommendation/get", response_model=RecommendationGetResponse)
def recommendation_get(req: RecommendationGetRequest, db: Session = Depends(get_db)):
    log_debug("recommendation_get_request", req.dict())

    if user:
        user = get_user_by_qr_id(db, req.qr_id)

    if not user:
        error_response(404, "User not found")

    # request Done!

    categories = get_types_by_group(db, RECOMMENDATION_GROUP_ID)
    log_debug("recommendations", [r.type_code for r in recommendations])

    recommendations = {}

    for recommendation in recommendations:
        products = recommend_products(db, user, product.id)
        key = f"{product.type_code.lower()}_info"
        recommendations[key] = []
        for r, matched_tags in products:
            recommend = get_recommendation(db, user.id, r.id)
            recommendations[key].append({
                "id": r.id,
                "product_name": r.product_name,
                "category": r.category,
                "brand": r.brand,
                "sstore_recommend": True if recommend else False,
                "price": r.price,
            })




    return RecommendationGetResponse(
        user_id=user.id,
        **recommendations    
        )
