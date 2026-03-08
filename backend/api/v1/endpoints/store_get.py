from api.v1.utils.business_logic import error_response
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.v1.utils.db_utils import get_store
from api.v1.utils.log_utils import log_debug
from db.session import get_db
from schemas import StoreGetResponse

router = APIRouter()

@router.post("/store/get", response_model=StoreGetResponse)
def store_get(db: Session = Depends(get_db)):
    log_debug("store_get start", "fetch store id=1000")
    store = get_store(db)

    log_debug("store_get result", store)
    if store is None:
        log_debug("store_get error", "Store not found")
        error_response(404, "Store not found")

    response = StoreGetResponse(
        id=store.id,
        name=store.store_name
    )
    log_debug("store_get response", response)

    return response