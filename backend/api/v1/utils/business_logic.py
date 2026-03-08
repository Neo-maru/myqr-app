from models.all_models import Product
import uuid
from fastapi import HTTPException
from sqlalchemy.orm import Session

from api.v1.utils.log_utils import log_debug
from api.v1.utils.db_utils import get_products_by_category_id, get_types_from_code, get_product_tags

def create_uuid():
    return str(uuid.uuid4())

def error_response(status_code: int, message: str):
    raise HTTPException(status_code=status_code, detail=message)


def recommend_products(db: Session, user, category):
    # ユーザー情報ログ
    log_debug("user info", {
        "personal_color": user.personal_color,
        "skin_concern": user.skin_concern,
        "face_type": user.face_type
    })

    # code → type_id 変換
    personal_color = get_types_from_code(db, user.personal_color)
    skin_concern = get_types_from_code(db, user.skin_concern)
    face_type = get_types_from_code(db, user.face_type)

    personal_color_id = personal_color.id if personal_color else None
    skin_concern_id = skin_concern.id if skin_concern else None
    face_type_id = face_type.id if face_type else None

    log_debug("user type ids", {
        "personal_color_id": personal_color_id,
        "skin_concern_id": skin_concern_id,
        "face_type_id": face_type_id
    })

    # 商品取得
    products = get_products_by_category_id(db, category)
    log_debug("products count", len(products))

    scored = []
    for product in products:
        score = 0
        matched_tags = []

        # 商品タグ取得
        tag_records = get_product_tags(db, product.id)
        tags = [t.type_id for t in tag_records]
        log_debug("product tags", {
            "product_id": product.id,
            "product_name": product.product_name,
            "tags": tags
        })

        # パーソナルカラー
        if personal_color_id and personal_color_id in tags:
            score += 3
            matched_tags.append(personal_color_id)

        # 肌悩み
        if skin_concern_id and skin_concern_id in tags:
            score += 2
            matched_tags.append(skin_concern_id)

        # 顔タイプ
        if face_type_id and face_type_id in tags:
            score += 1
            matched_tags.append(face_type_id)

        log_debug("score result", {
            "product_id": product.id,
            "score": score,
            "matched_tags": matched_tags
        })

        scored.append((score, product, matched_tags))

    # スコア順に並び替え
    scored.sort(key=lambda x: x[0], reverse=True)
    log_debug("top_score", scored[0][0] if scored else "no products")

    # 全部スコア0なら店舗おすすめ
    if scored and scored[0][0] == 0:
        log_debug("fallback", "store recommend used")
        store_products = db.query(Product).filter(
            Product.category == category,
            Product.store_recommend == 1
        ).limit(3).all()
        return [(p, ["店舗おすすめ"]) for p in store_products]

    # 上位3件
    result = []
    for score, product, matched_tags in scored[:3]:
        result.append((product, matched_tags))

    return result