from pydantic import BaseModel
from typing import List, Optional

# --- 共通の商品情報スキーマ ---
class ProductInfo(BaseModel):
    product_id: int
    product_name: str
    brand: str
    price: int
    product_tags: List[str]  # リスト形式で受け渡し
    is_recommendation: bool = False
    reaction: Optional[str] = None

    class Config:
        from_attributes = True

# --- 1. ユーザー情報取得 (POST /user/get) ---
class UserGetRequest(BaseModel):
    user_id: int

class UserGetResponse(BaseModel):
    user_id: int
    name: str
    personal_color: Optional[str] = None
    skin_concern: Optional[str] = None
    memo: Optional[str] = None
    face_type: Optional[str] = None

# --- 2. ユーザー新規登録/更新 (POST /user/post) ---
class UserPostRequest(BaseModel):
    token: Optional[str] = None
    user_id: int
    name: str
    personal_color: Optional[str] = None
    skin_concern: Optional[str] = None
    memo: Optional[str] = None
    face_type: Optional[str] = None

class UserPostResponse(BaseModel):
    token: str
    user_id: int
    qr_id: str
    name: str
    personal_color: Optional[str] = None
    skin_concern: Optional[str] = None
    face_type: Optional[str] = None

# --- 3. おすすめ商品取得 (POST /recommendation/get) ---
class RecommendationGetRequest(BaseModel):
    user_id: int

class RecommendationGetResponse(BaseModel):
    user_id: int
    base_info: List[ProductInfo]
    shadow_info: List[ProductInfo]
    lip_info: List[ProductInfo]

# --- 4. おすすめ商品の登録 (POST /recommendation/post) ---
class RecommendationPostRequest(BaseModel):
    user_id: int
    product_id: int

# --- 5. リアクション登録 (POST /reaction/post) ---
class ReactionPostRequest(BaseModel):
    user_id: int
    product_id: int
    reaction: Optional[str] = None

# --- 6. 店舗情報取得 (GET /store/get) ---
class StoreGetResponse(BaseModel):
    store_id: int
    store_name: str

# --- 7. お客様情報取得 (GET /user_info/get/{qr_id}) ---
class UserInfoResponse(BaseModel):
    user_id: int
    name: str
    personal_color: Optional[str] = None
    skin_concern: Optional[str] = None
    memo: Optional[str] = None
    face_type: Optional[str] = None
    base_info: List[ProductInfo]
    shadow_info: List[ProductInfo]
    lip_info: List[ProductInfo]