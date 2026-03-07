from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.v1.utils.db_utils import get_store
from db.session import get_db
from schemas import StoreGetRequest, StoreGetResponse

router = APIRouter()


@router.post("/store/get", response_model=StoreGetResponse)
def store_get(request: StoreGetRequest, db: Session = Depends(get_db)):
    store = get_store(db)

    if store is None:
        raise HTTPException(status_code=404, detail="Store not found")

    return StoreGetResponse(
        id=store.id,
        name=store.store_name
    )