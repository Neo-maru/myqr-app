from typing import Optional

from pydantic import BaseModel


# ===============================
# 共通スキーマ
# ===============================


class ProductInfo(BaseModel):
    product_id: int
    product_name: str
    brand: str
    price: int
    product_tags: list[str]
    type_id: int
    is_recommendation: bool = False

    class Config:
        from_attributes = True


class CustomerProductInfo(BaseModel):
    product_id: int
    product_name: str
    brand: str
    price: int
    product_tags: list[str]
    type_id: int
    is_recommendation: bool = True
    reaction: Optional[str] = None


# ===============================
# 1. ユーザー情報取得
# POST /user/get
# ===============================


class UserGetRequest(BaseModel):
    token: str


class UserGetResponse(BaseModel):
    user_id: int
    name: str
    personal_color: Optional[str] = None
    skin_concern: Optional[str] = None
    memo: Optional[str] = None
    face_type: Optional[str] = None


# ===============================
# 2. ユーザー新規登録 / 更新
# POST /user/post
# ===============================


class UserPostRequest(BaseModel):
    token: Optional[str] = None
    user_id: Optional[int] = None
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


# ===============================
# 3. 店舗用おすすめ商品取得
# POST /recommendation/get
# ===============================


class RecommendationGetRequest(BaseModel):
    user_id: int


class RecommendationGetResponse(BaseModel):
    user_id: int
    base_info: list[ProductInfo]
    shadow_info: list[ProductInfo]
    lip_info: list[ProductInfo]


# ===============================
# 4. 顧客用おすすめ商品取得
# POST /customer/recommendation/get
# ===============================


class CustomerRecommendationGetRequest(BaseModel):
    user_id: int


class CustomerRecommendationGetResponse(BaseModel):
    user_id: int
    base_info: list[CustomerProductInfo]
    shadow_info: list[CustomerProductInfo]
    lip_info: list[CustomerProductInfo]


# ===============================
# 5. おすすめ商品登録
# POST /recommendation/post
# ===============================


class RecommendationPostRequest(BaseModel):
    user_id: int
    product_id: int
    store_id: int


class RecommendationPostResponse(BaseModel):
    status: str


# ===============================
# 6. リアクション登録
# POST /reaction/post
# ===============================


class ReactionPostRequest(BaseModel):
    user_id: int
    product_id: int
    store_id: int
    reaction: Optional[str] = None


class ReactionPostResponse(BaseModel):
    status: str


# ===============================
# 7. お客様情報取得
# GET /user_info/get/{qr_id}
# ===============================


class UserInfoResponse(BaseModel):
    user_id: int
    name: str
    personal_color: Optional[str] = None
    skin_concern: Optional[str] = None
    memo: Optional[str] = None
    face_type: Optional[str] = None
    base_info: list[ProductInfo]
    shadow_info: list[ProductInfo]
    lip_info: list[ProductInfo]


# ===============================
# 8. 店舗情報取得
# GET /store/get
# ===============================


class StoreGetRequest(BaseModel):
    id: int


class StoreGetResponse(BaseModel):
    id: int
    name: str
