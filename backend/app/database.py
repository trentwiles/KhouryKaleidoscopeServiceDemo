from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import get_settings

settings = get_settings()

# create engine with connection pool settings
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,  # verify connections before using
    pool_size=5,
    max_overflow=10,
)

# session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# base class for models
Base = declarative_base()


def get_db():
    # dependency that provides db session
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()