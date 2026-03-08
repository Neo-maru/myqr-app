"""商品データをAPIレスポンス用に変換するユーティリティ"""

from typing import Optional

from sqlalchemy.orm import Session

from models.all_models import Product, Type

from api.v1.utils.db_utils import get_type_by_id, get_product_tags


def resolve_brand_name(db: Session, brand_type_id: Optional[int]) -> str:
    """ブランドのtype_idを表示名（文字列）に変換する"""
    if brand_type_id is None:
        return ""
    brand_type = get_type_by_id(db, brand_type_id)
    return brand_type.type_name if brand_type else str(brand_type_id)


def resolve_product_tags(db: Session, product_id: int) -> list[str]:
    """商品のtype_id一覧を表示名（type_name）のリストに変換する"""
    tag_records = get_product_tags(db, product_id)
    names = []
    for tag in tag_records:
        tag_type = get_type_by_id(db, tag.type_id)
        if tag_type:
            names.append(tag_type.type_name)
    return names


def build_product_info(
    db: Session,
    product: Product,
    category: Type,
    product_tags: list[str],
    is_recommendation: bool = False,
    reaction: Optional[str] = None,
) -> dict:
    """ProductをAPIレスポンス用の辞書に変換する"""
    brand_name = resolve_brand_name(db, product.brand)
    return {
        "product_id": product.id,
        "product_name": product.product_name,
        "brand": brand_name,
        "price": product.price,
        "product_tags": product_tags,
        "type_id": category.id,
        "is_recommendation": is_recommendation,
        "reaction": reaction,
    }
