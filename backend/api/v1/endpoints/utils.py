from fastapi import HTTPException
from sqlalchemy.orm import Session
import uuid
from models.all_models import User, Product, ProductTag, Recommendation, Store, Type

# error_response	エラー生成
def error_response(status_code: int, message: str):
  raise HTTPException(status_code=status_code, detail=message)

# DBコミット関数
def safe_commit(db: Session):
  try:
    db.commit()
  except Exception as e:
    db.rollback()
    print(f"DB Commit Error: {e}")
    raise HTTPException(status_code=500, detail="Database error occurred")

# get_user_by_token	tokenユーザー（ユーザー側で情報取得）
def get_user_by_token(db: Session, token: str):
  return db.query(User).filter(User.token == token).first()

# get_user_by_qr_id	QRユーザー（店舗側で情報取得）
def get_user_by_qr_id(db: Session, qr_id: str):
  return db.query(User).filter(User.qr_id == qr_id).first()

# get_all_products	商品取得
def get_all_products(db: Session):
  return db.query(Product).all()

# get_product_tags→　商品タグ取得
def get_product_tags(db: Session, product_id: int):
  return db.query(ProductTag).filter(ProductTag.product_id == product_id).all()

# get_store→ 店舗情報取得
def get_store(db: Session):
  return db.query(Store).filter(Store.id == 1000).first()

# get_type_id_from_code	type変換
def get_type_id_from_code(db: Session, type_code: str):
  record = db.query(Type).filter(Type.code == type_code).first()
  return record.id if record else None

# create_uuid	UUID生成
def create_uuid():
  return str(uuid.uuid4())

# calculate_recommend_products	レコメンド
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

  # おすすめ商品が0件だった場合
  if scored and scored[0][0] == 0:
    store_products = db.query(Product).filter(
      Product.category == category,
      Product.store_recommend == 1
    ).limit(3).all()
    return store_products
  return [p for score, p in scored[:3]]

# toggle_recommendation	 おすすめ登録/削除
def toggle_recommendation(db, user_id, product_id):
  record = db.query(Recommendation).filter(
    Recommendation.user_id == user_id,
    Recommendation.product_id == product_id
  ).first()

  if record:
    db.delete(record)
  else:
    new_rec = Recommendation(
      user_id=user_id,
      product_id=product_id
    )
    db.add(new_rec)
# upsert_reaction	リアクション更新
def upsert_reaction(db: Session, user_id: int, product_id: int, reaction: str):
  record = db.query(Recommendation).filter(
    Recommendation.user_id == user_id,
    Recommendation.product_id == product_id
  ).first()

  if not record:
    # おすすめデータが存在しない場合はエラーを投げる
    error_response(
      status_code=400, 
      message="商品の提案が見つからなかったため、リアクションを登録できませんでした。"
    )

  record.reaction = reaction
  return record