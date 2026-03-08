from sqlalchemy.orm import Session
from models.all_models import User, Product, ProductTag, Store, Type, Recommendation

def get_user_by_token(db: Session, token: str):
    return db.query(User).filter(User.token == token).first()

def get_user_by_qr_id(db: Session, qr_id: str):
    return db.query(User).filter(User.qr_id == qr_id).first()

def get_all_products(db: Session):
    return db.query(Product).all()

def get_products_by_category_id(db: Session, category_id: int):
    return db.query(Product).filter(Product.category == category_id).all()

def get_product_tags(db: Session, product_id: int):
    return db.query(ProductTag).filter(ProductTag.product_id == product_id).all()

def get_store(db: Session):
    return db.query(Store).filter(Store.id == 1000).first()

def get_types_from_code(db: Session, type_code: str):
    record = db.query(Type).filter(Type.type_code == type_code).first()
    return record if record else None

def get_types_by_group(db: Session, type_group: int):
    return db.query(Type).filter(Type.type_group == type_group).all()

def get_recommendation(db: Session, user_id: int, product_id: int, store_id: int | None = None):
    query = db.query(Recommendation).filter(
        Recommendation.user_id == user_id,
        Recommendation.product_id == product_id
    )
    if store_id is not None:
        query = query.filter(Recommendation.store_id == store_id)
    return query.first()