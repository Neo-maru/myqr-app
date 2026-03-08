from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.session import get_db
from schemas import UserInfoResponse

from api.v1.utils.business_logic import error_response, recommend_products
from api.v1.utils.db_utils import get_recommendation, get_types_by_group, get_user_by_qr_id
from api.v1.utils.log_utils import log_debug
from api.v1.utils.product_utils import build_product_info
from api.v1.utils.user_utils import resolve_type_id_to_name

router = APIRouter()

PRODUCT_CATEGORY_GROUP_ID = 4


@router.get("/user_info/get/{qr_id}", response_model=UserInfoResponse)
def user_info_get(qr_id: str, db: Session = Depends(get_db)):
    log_debug("user_info_get_qr_id", qr_id)

    user = get_user_by_qr_id(db, qr_id)
    if not user:
        log_debug("user_info_get_error", "User not found")
        return error_response(404, "User not found")

    categories = get_types_by_group(db, PRODUCT_CATEGORY_GROUP_ID)
    log_debug("product_categories", [c.type_code for c in categories])

    category_products: dict[str, list] = {
        "base_info": [],
        "shadow_info": [],
        "lip_info": [],
    }

    for category in categories:
        products = recommend_products(db, user, category.id)
        key = f"{category.type_code.lower()}_info"
        if key not in category_products:
            continue

        for product, tag_names in products:
            recommend = get_recommendation(db, user.id, product.id)
            item = build_product_info(
                db,
                product,
                category,
                tag_names,
                is_recommendation=recommend is not None,
                reaction=recommend.reaction if recommend else None,
            )
            category_products[key].append(item)

    return UserInfoResponse(
        user_id=user.id,
        name=user.name,
        personal_color=resolve_type_id_to_name(db, user.personal_color),
        skin_concern=resolve_type_id_to_name(db, user.skin_concern),
        memo=user.memo,
        face_type=resolve_type_id_to_name(db, user.face_type),
        base_info=category_products["base_info"],
        shadow_info=category_products["shadow_info"],
        lip_info=category_products["lip_info"],
    )
