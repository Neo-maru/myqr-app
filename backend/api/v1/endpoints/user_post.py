from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.session import get_db
from models.all_models import User
from schemas import UserPostRequest, UserPostResponse

from api.v1.utils.business_logic import create_uuid
from api.v1.utils.db_utils import get_user_by_token
from api.v1.utils.log_utils import log_debug
from api.v1.utils.user_utils import resolve_type_code_to_id, resolve_type_id_to_name

router = APIRouter()


@router.post("/user/post", response_model=UserPostResponse)
def user_post(request: UserPostRequest, db: Session = Depends(get_db)):
    log_debug("user_post request", request)

    user = get_user_by_token(db, request.token) if request.token else None

    personal_color_id = resolve_type_code_to_id(db, request.personal_color)
    skin_concern_id = resolve_type_code_to_id(db, request.skin_concern)
    face_type_id = resolve_type_code_to_id(db, request.face_type)

    if user:
        log_debug("user_post", "update user")
        user.name = request.name
        user.personal_color = personal_color_id
        user.skin_concern = skin_concern_id
        user.memo = request.memo
        user.face_type = face_type_id
    else:
        log_debug("user_post", "create user")
        user = User(
            token=create_uuid(),
            qr_id=create_uuid(),
            name=request.name,
            personal_color=personal_color_id,
            skin_concern=skin_concern_id,
            memo=request.memo,
            face_type=face_type_id,
        )
        db.add(user)

    db.commit()
    db.refresh(user)

    response = UserPostResponse(
        token=user.token,
        user_id=user.id,
        qr_id=user.qr_id,
        name=user.name,
        personal_color=resolve_type_id_to_name(db, user.personal_color),
        skin_concern=resolve_type_id_to_name(db, user.skin_concern),
        face_type=resolve_type_id_to_name(db, user.face_type),
    )
    log_debug("user_post response", response)
    return response
