from datetime import datetime, timedelta
from typing import Annotated
from jose import jwt
from jose.exceptions import JOSEError
from fastapi import HTTPException, status, Depends, APIRouter
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel


SECRET_KEY = "un2t90587tnyg2347t2348t7g4c83m0b14t3068v4hcg1uris3ey9ksdi13j1ro"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

router = APIRouter()

class Token(BaseModel):
    access_token: str
    token_type: str


@router.get("/user/create_token")
async def create_access_token(username: str, expires_delta: timedelta = timedelta(minutes=20)):
    encode = {'username': username}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm = ALGORITHM)


async def has_access(credentials: HTTPAuthorizationCredentials= Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, key='secret', options={"verify_signature": False,
                                                           "verify_aud": False,
                                                           "verify_iss": False})
        print("payload => ", payload)
    except JOSEError as e:  # catches any exception
        raise HTTPException(
            status_code=401,
            detail=str(e))