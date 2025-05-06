from sqlalchemy.orm import Session
from . import models, schemas


def get_movie(db: Session, movie_id: int):
    return db.query(models.Movie).filter(models.Movie.id == movie_id).first()


def get_movies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Movie).offset(skip).limit(limit).all()


def create_movie(db: Session, movie: schemas.MovieBase):
    db_movie = models.Movie(**movie.dict())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie


def get_rating(db: Session, rating_id: int):
    return db.query(models.Rating).filter(models.Rating.id == rating_id).first()


def get_ratings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Rating).offset(skip).limit(limit).all()


def create_rating(db: Session, rating: schemas.RatingCreate, user_id: int = 1):
    db_rating = models.Rating(**rating.dict(), user_id=user_id)
    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)
    return db_rating


def update_rating(db: Session, rating_id: int, rating: schemas.RatingCreate):
    db_rating = db.query(models.Rating).filter(models.Rating.id == rating_id).first()
    if db_rating:
        for key, value in rating.dict().items():
            setattr(db_rating, key, value)
        db.commit()
        db.refresh(db_rating)
    return db_rating


def get_user_ratings(db: Session, user_id: int = 1):
    return db.query(models.Rating).filter(models.Rating.user_id == user_id).all()
