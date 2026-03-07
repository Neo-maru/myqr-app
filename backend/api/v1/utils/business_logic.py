from models.all_models import Recommendation, Product
import uuid
from fastapi import HTTPException
from sqlalchemy.orm import Session

def create_uuid():
    return str(uuid.uuid4())

def error_response(status_code: int, message: str):
    raise HTTPException(status_code=status_code, detail=message)


def recommend_products(db, user, category):
    products = db.query(Product).filter(
        Product.category == category
    ).all()

    scored = []
    for product in products:
        score = 0
        tags = [t.type_id for t in product.tags] if product.tags else []

        if user.personal_color and user.personal_color in tags:
            score += 3

        if user.skin_concern and user.skin_concern in tags:
            score += 2

        if user.face_type and user.face_type in tags:
            score += 1

        scored.append((score, product))

    scored.sort(key=lambda x: x[0], reverse=True)

    if scored and scored[0][0] == 0:
        store_products = db.query(Product).filter(
            Product.category == category,
            Product.store_recommend == 1
        ).limit(3).all()
        return store_products

    return [p for score, p in scored[:3]]