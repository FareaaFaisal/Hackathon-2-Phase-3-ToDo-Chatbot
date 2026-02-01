# backend/app/core/security.py
from datetime import datetime, timedelta
from typing import Optional

from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"


def _truncate_password(password: str) -> str:
    return password.encode("utf-8")[:72].decode("utf-8", errors="ignore")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(_truncate_password(password))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(_truncate_password(plain_password), hashed_password)


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta
        if expires_delta
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.BETTER_AUTH_SECRET,  # ✅ ONLY THIS
        algorithm=ALGORITHM,
    )


def verify_jwt(token: str) -> Optional[int]:
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,  # ✅ SAME SECRET
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")
        if not user_id:
            return None

        return int(user_id)

    except JWTError as e:
        print(f"DEBUG: JWTError during verification: {e}")
        return None
