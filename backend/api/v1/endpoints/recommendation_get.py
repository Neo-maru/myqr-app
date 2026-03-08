from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from schemas import CustomerRecommendationGetRequest, CustomerRecommendationGetResponse
from db.session import get_db

from api.v1.utils.business_logic import error_response
from api.v1.utils.db_utils import (
    get_user_by_user_id,
    get_product_by_product_id,
    get_recommendations_by_user,
    get_type_by_id,
    get_product_tags,
)
from api.v1.utils.log_utils import log_debug

router = APIRouter()

@router.post("/recommendation/get", response_model=CustomerRecommendationGetResponse)
def recommendation_get(req: CustomerRecommendationGetRequest, db: Session = Depends(get_db)):

    log_debug("recommendation_get_request", req.dict())

    # ① ユーザー取得
    user = get_user_by_user_id(db, req.user_id)
    if not user:
        return error_response(404, "User not found")

    # ② recommendation取得
    recs = get_recommendations_by_user(db, req.user_id)

    # ③ レスポンス用リスト
    category_products = {}

    for rec in recs:

        # ④ product取得
        product = get_product_by_product_id(db, rec.product_id)
        if not product:
            continue

        # ⑤ category → types取得
        category = get_type_by_id(db, product.category)
        if not category:
            continue

        # ブランド名取得（Typeテーブルから文字列に変換）
        brand_name = ""
        if product.brand is not None:
            brand_type = get_type_by_id(db, product.brand)
            brand_name = brand_type.type_name if brand_type else str(product.brand)

        # 商品タグ取得（Typeコードのリストに変換）
        tag_records = get_product_tags(db, product.id)
        product_tags = []
        for tag in tag_records:
            tag_type = get_type_by_id(db, tag.type_id)
            if tag_type:
                product_tags.append(tag_type.type_code)

        # ⑥ base_info / shadow_info / lip_info 作成
        key = f"{category.type_code.lower()}_info"

        if key not in category_products:
            category_products[key] = []

        item = {
            "product_id": product.id,
            "product_name": product.product_name,
            "brand": brand_name,
            "price": product.price,
            "product_tags": product_tags,
            "type_id": category.id,
            "reaction": rec.reaction
        }

        category_products[key].append(item)

    # ⑦ レスポンス返却
    return CustomerRecommendationGetResponse(
        user_id=user.id,
        base_info=category_products.get("base_info", []),
        shadow_info=category_products.get("shadow_info", []),
        lip_info=category_products.get("lip_info", [])
    )