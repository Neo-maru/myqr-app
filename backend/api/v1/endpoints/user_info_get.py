from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.session import get_db
from api.v1.utils.db_utils import get_user_by_qr_id, get_types_by_group, get_recommendation
from api.v1.utils.log_utils import log_debug
from api.v1.utils.business_logic import error_response, recommend_products

router = APIRouter()

# 商品カテゴリのタイプID
PRODUCT_CATEGORY_GROUP_ID = 4

@router.get("/user_info/get/{qr_id}")
def user_info_get(qr_id: str, db: Session = Depends(get_db)):
    log_debug("user_info_get_qr_id", qr_id)
    user = get_user_by_qr_id(db, qr_id)
    if not user:
        log_debug("user_info_get_error", "User not found")
        error_response(404, "User not found")

    categories = get_types_by_group(db, PRODUCT_CATEGORY_GROUP_ID)
    log_debug("product_categories", [c.type_code for c in categories])

    category_products = {}

    for category in categories:
        products = recommend_products(db, user, category.id)
        key = f"{category.type_code.lower()}_info"
        category_products[key] = []
        for p, matched_tags in products:
            recommend = get_recommendation(db, user.id, p.id)
            category_products[key].append({
                "product_id": p.id,
                "product_name": p.product_name,
                "brand": p.brand,
                "price": p.price,
                "product_tags": matched_tags,
                "is_recommendation": True if recommend else False
            })

    return {
        "user_id": user.id,
        "name": user.name,
        "personal_color": user.personal_color,
        "skin_concern": user.skin_concern,
        "memo": user.memo,
        "face_type": user.face_type,
        **category_products
    }