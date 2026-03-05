from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import settings

db_url = settings.SQLALCHEMY_DATABASE_URL

# local環境ではsqliteを使用
if db_url.startswith("sqlite"):
  engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
  # 本番環境ではVercel Postgresを使用
  engine = create_engine(db_url)

SessionLocal = sessionmaker(
  autocommit=False,
  autoflush=False,
  bind=engine
)

Base = declarative_base()