from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

  # 環境変数の宣言
  DATABASE_URL: str
  FRONTEND_BASE_URL: str
  
  # Postgreへの変換時に使用
  @property
  def SQLALCHEMY_DATABASE_URL(self) -> str:
    if self.DATABASE_URL.startswith("postgres://"):
      return self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
    return self.DATABASE_URL

settings = Settings()