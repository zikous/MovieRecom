# schemas.py
from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class MovieBase(BaseModel):
    id: int
    title: str
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    vote_average: Optional[float] = None
    genres: Optional[str] = None
    categories: Optional[str] = None

    class Config:
        from_attributes = True


class Movie(MovieBase):
    pass


class MovieListResponse(BaseModel):
    results: List[MovieBase]


class RatingValue(float, Enum):
    ZERO = 0
    ONE = 1.0
    TWO = 2.0
    THREE = 3.0
    FOUR = 4.0
    FIVE = 5.0


class RatingCreate(BaseModel):
    movie_id: int
    rating: RatingValue


class Rating(RatingCreate):
    id: int

    class Config:
        from_attributes = True
