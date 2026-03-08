from typing import Optional

from sqlalchemy.orm import Session

from models.all_models import User, Product, ProductTag, Store, Type, Recommendation


def get_user_by_token(db: Session, token: str) -> Optional[User]:
    return db.query(User).filter(User.token == token).first()


def get_user_by_qr_id(db: Session, qr_id: str) -> Optional[User]:
    return db.query(User).filter(User.qr_id == qr_id).first()


def get_user_by_user_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_all_products(db: Session) -> list[Product]:
    return db.query(Product).all()


def get_product_by_product_id(db: Session, product_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()


def get_products_by_category_id(db: Session, category_id: int) -> list[Product]:
    return db.query(Product).filter(Product.category == category_id).all()


def get_product_tags(db: Session, product_id: int) -> list[ProductTag]:
    return db.query(ProductTag).filter(ProductTag.product_id == product_id).all()


def get_store(db: Session, store_id: int = 1000) -> Optional[Store]:
    return db.query(Store).filter(Store.id == store_id).first()


def get_type_by_id(db: Session, type_id: int) -> Optional[Type]:
    return db.query(Type).filter(Type.id == type_id).first()


def get_types_from_code(db: Session, type_code: str) -> Optional[Type]:
    return db.query(Type).filter(Type.type_code == type_code).first()


def get_types_by_group(db: Session, type_group: int) -> list[Type]:
    return db.query(Type).filter(Type.type_group == type_group).all()


def get_recommendation(
    db: Session,
    user_id: int,
    product_id: int,
    store_id: Optional[int] = None,
) -> Optional[Recommendation]:
    query = (
        db.query(Recommendation)
        .filter(Recommendation.user_id == user_id)
        .filter(Recommendation.product_id == product_id)
    )
    if store_id is not None:
        query = query.filter(Recommendation.store_id == store_id)
    return query.first()


def get_recommendations_by_user(db: Session, user_id: int) -> list[Recommendation]:
    return db.query(Recommendation).filter(Recommendation.user_id == user_id).all()
