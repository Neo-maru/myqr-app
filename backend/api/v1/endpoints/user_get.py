from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.session import get_db
from schemas import UserGetRequest, UserGetResponse

from api.v1.utils.business_logic import error_response
from api.v1.utils.db_utils import get_user_by_token
from api.v1.utils.log_utils import log_debug
from api.v1.utils.user_utils import resolve_type_id_to_name

router = APIRouter()


@router.post("/user/get", response_model=UserGetResponse)
def user_get(req: UserGetRequest, db: Session = Depends(get_db)):
    log_debug("user_get_request", req.model_dump())

    user = get_user_by_token(db, req.token)
    if not user:
        log_debug("user_get error", "User not found")
        return error_response(404, "User not found")

    return UserGetResponse(
        user_id=user.id,
        name=user.name,
        personal_color=resolve_type_id_to_name(db, user.personal_color),
        skin_concern=resolve_type_id_to_name(db, user.skin_concern),
        memo=user.memo,
        face_type=resolve_type_id_to_name(db, user.face_type),
    )
