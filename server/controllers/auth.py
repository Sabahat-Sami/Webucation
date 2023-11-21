from datetime import datetime, timedelta
from typing import Annotated
from jose import jwt
from jose.exceptions import JOSEError
from fastapi import HTTPException, status, Depends, APIRouter
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from config import SECRET_KEY as sk


SECRET_KEY = sk
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

@router.get("/user/verify_token")
async def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, options={"verify_signature": False,
                                                           "verify_aud": False,
                                                           "verify_iss": False})
        print('Token is valid:', payload)
        return {"payload":payload}
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Session has expired.")
    except jwt.JWTError as e:
        raise HTTPException(
            status_code=401,
            detail="Session verification failed.")

async def has_access(credentials: HTTPAuthorizationCredentials= Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, key='secret', options={"verify_signature": False,
                                                           "verify_aud": False,
                                                           "verify_iss": False})
        print("payload => ", payload)
        return payload
    except JOSEError as e:  # catches any exception
        raise HTTPException(
            status_code=401,
            detail=str(e))