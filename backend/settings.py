from pydantic_settings import BaseSettings


class CommonSettings(BaseSettings):
    APP_NAME: str = "Digital Neurology"
    DEBUG_MODE: bool = False


class ServerSettings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000


class DatabaseSettings(BaseSettings):
    DB_URL: str = "mongodb://localhost:27017"  # find a way to read this from env file. avoid storing this info publicly
    DB_NAME: str = "digiNeu"


class Settings(CommonSettings, ServerSettings, DatabaseSettings):
    pass

settings = Settings()