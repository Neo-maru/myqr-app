"""ユーザー関連の型変換ユーティリティ"""

from typing import Optional

from sqlalchemy.orm import Session

from api.v1.utils.db_utils import get_type_by_id, get_types_from_code


def resolve_type_id_to_name(db: Session, type_id: Optional[int]) -> Optional[str]:
    """type_idを表示名（type_name）に変換する。Noneの場合はNoneを返す"""
    if type_id is None:
        return None
    type_obj = get_type_by_id(db, type_id)
    return type_obj.type_name if type_obj else str(type_id)


def resolve_type_code_to_id(db: Session, type_code: Optional[str]) -> Optional[int]:
    """type_codeまたはtype_id(文字列)をtype_idに変換する。Noneの場合はNoneを返す"""
    if type_code is None or type_code == "":
        return None
    type_obj = get_types_from_code(db, type_code)
    if type_obj:
        return type_obj.id
    try:
        tid = int(type_code)
        type_obj = get_type_by_id(db, tid)
        return type_obj.id if type_obj else None
    except (ValueError, TypeError):
        return None
