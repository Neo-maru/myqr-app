from sqlalchemy.orm import Session
from models.all_models import User, Product, ProductTag, Store, Type

def get_user_by_token(db: Session, token: str):
    return db.query(User).filter(User.token == token).first()

def get_user_by_qr_id(db: Session, qr_id: str):
    return db.query(User).filter(User.qr_id == qr_id).first()

def get_all_products(db: Session):
    return db.query(Product).all()

def get_product_tags(db: Session, product_id: int):
    return db.query(ProductTag).filter(ProductTag.product_id == product_id).all()

def get_store(db: Session):
    return db.query(Store).filter(Store.id == 1000).first()

def get_type_id_from_code(db: Session, type_code: str):
    record = db.query(Type).filter(Type.code == type_code).first()
    return record.id if record else None