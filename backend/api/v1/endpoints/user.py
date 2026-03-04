from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    user_token: Optional[str] = None

class UserResponse(BaseModel):
  id: Optional[int] = None
  name: Optional[str] = None
  