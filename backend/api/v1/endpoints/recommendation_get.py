from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.session import get_db
from schemas import CustomerRecommendationGetRequest, CustomerRecommendationGetResponse

from api.v1.utils.business_logic import error_response
from api.v1.utils.db_utils import (
    get_product_by_product_id,
    get_recommendations_by_user,
    get_type_by_id,
    get_user_by_user_id,
)
from api.v1.utils.log_utils import log_debug
from api.v1.utils.product_utils import build_product_info, resolve_product_tags

router = APIRouter()

CATEGORY_KEYS = ("base_info", "shadow_info", "lip_info")


@router.post("/recommendation/get", response_model=CustomerRecommendationGetResponse)
def recommendation_get(req: CustomerRecommendationGetRequest, db: Session = Depends(get_db)):
    log_debug("recommendation_get_request", req.model_dump())

    user = get_user_by_user_id(db, req.user_id)
    if not user:
        return error_response(404, "User not found")

    recs = get_recommendations_by_user(db, req.user_id)
    category_products: dict[str, list] = {k: [] for k in CATEGORY_KEYS}

    for rec in recs:
        product = get_product_by_product_id(db, rec.product_id)
        if not product:
            continue

        category = get_type_by_id(db, product.category)
        if not category:
            continue

        key = f"{category.type_code.lower()}_info"
        if key not in category_products:
            continue

        product_tags = resolve_product_tags(db, product.id)
        item = build_product_info(
            db,
            product,
            category,
            product_tags,
            is_recommendation=True,
            reaction=rec.reaction,
        )
        category_products[key].append(item)

    return CustomerRecommendationGetResponse(
        user_id=user.id,
        base_info=category_products["base_info"],
        shadow_info=category_products["shadow_info"],
        lip_info=category_products["lip_info"],
    )
