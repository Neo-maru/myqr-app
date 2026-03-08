from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from schemas import UserGetRequest, UserGetResponse

from db.session import get_db
from api.v1.utils.db_utils import get_user_by_token
from api.v1.utils.log_utils import log_debug
from api.v1.utils.business_logic import error_response

router = APIRouter()

@router.post("/user/get", response_model=UserGetResponse)
def user_get(req: UserGetRequest, db: Session = Depends(get_db)):
    log_debug("user_get_request", req.dict())
    user = get_user_by_token(db, req.token)

    if not user:
        log_debug("user_get error", "User not found")
        error_response(404, "User not found")

    return UserGetResponse(
        user_id=user.id,
        name=user.name,
        personal_color=user.personal_color,
        skin_concern=user.skin_concern,
        memo=user.memo,
        face_type=user.face_type
    )