from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    overview = Column(Text)
    poster_path = Column(String)
    vote_average = Column(Float)
    genres = Column(String)

    ratings = relationship("Rating", back_populates="movie")


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, default=1)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    rating = Column(Float)

    movie = relationship("Movie", back_populates="ratings")
