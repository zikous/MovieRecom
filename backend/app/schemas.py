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

    class Config:
        from_attributes = True


class Movie(MovieBase):
    pass


class MovieListResponse(BaseModel):
    results: List[MovieBase]


class RatingValue(float, Enum):
    HALF = 0.5
    ONE = 1.0
    ONE_HALF = 1.5
    TWO = 2.0
    TWO_HALF = 2.5
    THREE = 3.0
    THREE_HALF = 3.5
    FOUR = 4.0
    FOUR_HALF = 4.5
    FIVE = 5.0


class RatingCreate(BaseModel):
    movie_id: int
    rating: RatingValue


class Rating(RatingCreate):
    id: int
    user_id: int = 1

    class Config:
        from_attributes = True
