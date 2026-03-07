from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.session import get_db
from schemas import UserPostRequest, UserPostResponse
from api.v1.utils.db_utils import get_user_by_token
from api.v1.utils.log_utils import log_debug
from api.v1.utils.business_logic import create_uuid

from models.all_models import User

router = APIRouter()

@router.post("/user/post", response_model=UserPostResponse)
def user_post(request: UserPostRequest, db: Session = Depends(get_db)):
    log_debug("user_post request", request)
    user = None

    # tokenがある場合 → update
    if request.token:
        user = get_user_by_token(db, request.token)

    if user:
        log_debug("user_post", "update user")
        user.name = request.name
        user.personal_color = request.personal_color
        user.skin_concern = request.skin_concern
        user.memo = request.memo
        user.face_type = request.face_type

    else:
        log_debug("user_post", "create user")
        token = create_uuid()
        qr_id = create_uuid()
        user = User(
            token=token,
            qr_id=qr_id,
            name=request.name,
            personal_color=request.personal_color,
            skin_concern=request.skin_concern,
            memo=request.memo,
            face_type=request.face_type
        )
        db.add(user)

    db.commit()
    db.refresh(user)

    response = UserPostResponse(
        token=user.token,
        user_id=user.id,
        qr_id=user.qr_id,
        name=user.name,
        personal_color=user.personal_color,
        skin_concern=user.skin_concern,
        face_type=user.face_type
    )
    log_debug("user_post response", response)

    return response