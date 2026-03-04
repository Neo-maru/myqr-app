from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from db.session import Base

# --- 1. User (ユーザー情報) ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    token = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    personal_color = Column(Integer, nullable=True)
    face_type = Column(Integer, nullable=True)
    skin_concern = Column(Integer, nullable=True)
    memo = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=True)

# --- 2. Product (商品マスタ) ---
class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(Integer, nullable=False)  # types.id
    brand = Column(Integer, nullable=True)      # types.id

# --- 3. ProductTag (商品タグ) ---
class ProductTag(Base):
    __tablename__ = "product_tags"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(Integer, nullable=False)
    tags = Column(Integer, nullable=False)      # types.id

# --- 4. Recommendation (提案) ---
class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    product_id = Column(Integer, nullable=False)
    store_id = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

# --- 5. Reaction (リアクション) ---
class Reaction(Base):
    __tablename__ = "reactions"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    recommendation_id = Column(Integer, unique=True, nullable=False) # UQ制約
    reaction_type = Column(String, nullable=True)
    del_flg = Column(Integer, default=0, nullable=False) # 0=リアクション中, 1=削除済
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=True)

# --- 6. Store (店舗マスタ) ---
class Store(Base):
    __tablename__ = "stores"
    id = Column(Integer, primary_key=True, index=True)
    store_name = Column(String, nullable=False)

# --- 7. Type (タイプマスタ) ---
class Type(Base):
    __tablename__ = "types"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type_group = Column(Integer, nullable=False) # 1=カラー, 2=悩み...
    code = Column(String, nullable=False)        # SUMMER, LIP等
    name = Column(String, nullable=False)        # ブルベ夏, 口紅等