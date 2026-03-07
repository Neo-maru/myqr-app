from pydantic import BaseModel
from typing import Optional, List


# ============================================
# 1. ユーザー情報取得 POST /user/get
# ============================================
class UserGetRequest(BaseModel):
    token: Optional[str] = None


class UserGetResponse(BaseModel):
    user_id: int
    qr_id: str
    name: str
    personal_color: Optional[str] = None
    skin_concern: Optional[str] = None
    memo: Optional[str] = None
    face_type: Optional[str] = None


# ============================================
# 2. ユーザー新規登録/更新 POST /user/post
# ============================================
class UserPostRequest(BaseModel):
    token: Optional[str] = None
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
    memo: Optional[str] = None
    face_type: Optional[str] = None


# ============================================
# 3. お客様情報取得 GET /user_info/{qr_id}
# ============================================
class ProductInfo(BaseModel):
    product_id: Optional[int] = None
    product_name: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[int] = None
    product_tags: Optional[str] = None
    is_recomendation: bool


class UserInfoResponse(BaseModel):
    user_id: int
    name: str
    personal_color: Optional[str] = None
    skin_concern: Optional[str] = None
    memo: Optional[str] = None
    face_type: Optional[str] = None
    base_info: Optional[ProductInfo] = None
    shadow_info: Optional[ProductInfo] = None
    lip_info: Optional[ProductInfo] = None


# ============================================
# 4. おすすめ商品の登録 POST /recommendation
# ============================================
class RecommendationRequest(BaseModel):
    user_id: int
    product_id: int


# ============================================
# 5. リアクション登録 POST /reaction
# ============================================
class ReactionRequest(BaseModel):
    user_id: int
    product_id: int
    reaction: Optional[str] = None


# ============================================
# 6. 店舗情報取得 GET /store
# ============================================
class StoreResponse(BaseModel):
    store_id: int
    store_name: str


# class StoreListResponse(BaseModel):
#     stores: List[StoreResponse]
