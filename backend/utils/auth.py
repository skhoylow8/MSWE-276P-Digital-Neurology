from datetime import datetime, timedelta

from fastapi import Depends
from jose import jwt, JWTError
from models.auth import DataToken
from passlib.context import CryptContext

ACCESS_TOKEN_EXPIRE_MINUTES = 120  # 2 hours
ALGORITHM = "HS256"
JWT_SECRET_KEY = "secret key"  # generate a key. should be kept secret. need to move to .env file

from fastapi.security import OAuth2
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from fastapi import Request
from fastapi.security.utils import get_authorization_scheme_param
from fastapi import HTTPException
from fastapi import status
from typing import Optional
from typing import Dict


class OAuth2PasswordBearerWithCookie(OAuth2):
    def __init__(
        self,
        tokenUrl: str,
        scheme_name: Optional[str] = None,
        scopes: Optional[Dict[str, str]] = None,
        auto_error: bool = True,
    ):
        if not scopes:
            scopes = {}
        flows = OAuthFlowsModel(password={"tokenUrl": tokenUrl, "scopes": scopes})
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=auto_error)

    async def __call__(self, request: Request) -> Optional[str]:
        authorization: str = request.cookies.get("X-AUTH")  #changed to accept access token from httpOnly Cookie
        print("access_token is",authorization)

        scheme, param = get_authorization_scheme_param(authorization)
        if not authorization or authorization.strip() == '':
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"NNo token provided",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                return None

        return authorization



password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl='/login')


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)


# check if I can use this code found on https://www.freecodecamp.org/news/how-to-add-jwt-authentication-in-fastapi/ or
# https://medium.com/@kevinkoech265/jwt-authentication-in-fastapi-building-secure-apis-ce63f4164eb2
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"expire": expire.strftime("%Y-%m-%d %H:%M:%S")})

    encoded_jwt = jwt.encode(to_encode, key=JWT_SECRET_KEY, algorithm=ALGORITHM)
    print(f"neiognioweugnweiougneo: token={encoded_jwt}")
    jwt.decode(encoded_jwt, JWT_SECRET_KEY, ALGORITHM)
    return encoded_jwt


def verify_token_access(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, key=JWT_SECRET_KEY, algorithms=ALGORITHM)

        id: str = payload.get("user_id")

        if id is None:
            raise credentials_exception
        token_data = DataToken(id=id)
    except JWTError as e:
        print(e)
        #raise credentials_exception
        raise e
    return token_data

# TODO make this not return a future
async def get_current_user(token: str = Depends(oauth2_scheme)):
    from app import app   # need to find a way to avoid this
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not Validate Credentials",
                                          headers={"WWW-Authenticate": "Bearer"})
    print(f"Token recieved: ({token})")

    token_data = verify_token_access(token, credentials_exception)
    id = token_data.id
    user = app.mongodb["Researcher"].find_one({"_id": id})

    return user
