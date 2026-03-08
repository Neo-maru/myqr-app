import uuid
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.all_models import Product

from api.v1.utils.db_utils import (
    get_product_tags,
    get_products_by_category_id,
    get_type_by_id,
)
from api.v1.utils.log_utils import log_debug


def create_uuid() -> str:
    return str(uuid.uuid4())


def error_response(status_code: int, message: str) -> None:
    raise HTTPException(status_code=status_code, detail=message)


def recommend_products(
    db: Session,
    user,
    category_id: int,
) -> list[tuple[Product, list[str]]]:
    """
    ユーザー属性に基づいて商品をスコアリングし、上位3件を返す。
    戻り値: [(product, matched_tag_names), ...]
    """
    log_debug("user info", {
        "personal_color": user.personal_color,
        "skin_concern": user.skin_concern,
        "face_type": user.face_type,
    })

    # Userはtype_idを保持 → Typeを取得
    personal_color = get_type_by_id(db, user.personal_color) if user.personal_color else None
    skin_concern = get_type_by_id(db, user.skin_concern) if user.skin_concern else None
    face_type = get_type_by_id(db, user.face_type) if user.face_type else None

    personal_color_id = personal_color.id if personal_color else None
    skin_concern_id = skin_concern.id if skin_concern else None
    face_type_id = face_type.id if face_type else None

    log_debug("user type ids", {
        "personal_color_id": personal_color_id,
        "skin_concern_id": skin_concern_id,
        "face_type_id": face_type_id,
    })

    products = get_products_by_category_id(db, category_id)
    log_debug("products count", len(products))

    scored: list[tuple[int, Product, list[str]]] = []
    for product in products:
        score = 0
        matched_tag_names: list[str] = []

        tag_records = get_product_tags(db, product.id)
        tag_ids = [t.type_id for t in tag_records]
        tag_names = []
        for t in tag_records:
            type_obj = get_type_by_id(db, t.type_id)
            if type_obj:
                tag_names.append(type_obj.type_name)

        log_debug("product tags", {
            "product_id": product.id,
            "product_name": product.product_name,
            "tags": tag_names,
        })

        if personal_color_id and personal_color_id in tag_ids:
            score += 3
            matched_tag_names.append(personal_color.type_name if personal_color else "")

        if skin_concern_id and skin_concern_id in tag_ids:
            score += 2
            matched_tag_names.append(skin_concern.type_name if skin_concern else "")

        if face_type_id and face_type_id in tag_ids:
            score += 1
            matched_tag_names.append(face_type.type_name if face_type else "")

        log_debug("score result", {
            "product_id": product.id,
            "score": score,
            "matched_tags": matched_tag_names,
        })

        scored.append((score, product, tag_names))

    scored.sort(key=lambda x: x[0], reverse=True)
    log_debug("top_score", scored[0][0] if scored else "no products")

    if scored and scored[0][0] == 0:
        log_debug("fallback", "store recommend used")
        store_products = (
            db.query(Product)
            .filter(Product.category == category_id, Product.store_recommend == 1)
            .limit(3)
            .all()
        )
        return [(p, ["店舗おすすめ"]) for p in store_products]

    return [(product, tag_names) for score, product, tag_names in scored[:3]]
