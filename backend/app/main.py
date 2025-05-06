from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import httpx
import os
from typing import List

from . import models, schemas, crud, recommender
from .database import SessionLocal, engine, get_db
from .config import settings

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Movie Recommendation API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# TMDB API setup
TMDB_BASE_URL = "https://api.themoviedb.org/3"


async def fetch_from_tmdb(endpoint: str, params: dict = None):
    headers = {
        "Authorization": f"Bearer {settings.TMDB_API_KEY}",
        "Content-Type": "application/json;charset=utf-8",
    }
    params = params or {}
    params["language"] = "en-US"

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/{endpoint}", params=params, headers=headers
        )
        if response.status_code == 200:
            return response.json()
        raise HTTPException(status_code=response.status_code, detail="TMDB API error")


@app.post("/seed", response_model=schemas.MovieListResponse)
async def seed_database(db: Session = Depends(get_db)):
    """Seed database with popular, top-rated, and upcoming movies"""
    categories = [
        ("movie/popular", "popular"),
        ("movie/top_rated", "top_rated"),
        ("movie/upcoming", "upcoming"),
    ]

    seeded_movies = []

    for endpoint, _ in categories:
        try:
            data = await fetch_from_tmdb(endpoint)
        except HTTPException as e:
            print(f"Error fetching {endpoint}: {e}")
            continue

        for movie in data["results"][:50]:  # Get first 50 from each category
            movie_id = movie["id"]

            # Check if movie already exists
            existing_movie = crud.get_movie(db, movie_id)
            if existing_movie:
                seeded_movies.append(existing_movie)
                continue

            # Fetch details for genres
            try:
                details = await fetch_from_tmdb(f"movie/{movie_id}")
                genres = ", ".join([g["name"] for g in details.get("genres", [])])
            except HTTPException:
                genres = ""

            # Create new movie
            movie_data = {
                "id": movie_id,
                "title": movie.get("title", ""),
                "overview": movie.get("overview", ""),
                "poster_path": movie.get("poster_path", ""),
                "vote_average": movie.get("vote_average", 0.0),
                "genres": genres,
            }

            db_movie = crud.create_movie(db, schemas.MovieBase(**movie_data))
            seeded_movies.append(db_movie)

    return {"results": seeded_movies}


@app.get("/movies/", response_model=schemas.MovieListResponse)
def read_movies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    movies = crud.get_movies(db, skip=skip, limit=limit)
    return {"results": movies}


@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def read_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = crud.get_movie(db, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


@app.post("/ratings/", response_model=schemas.Rating)
def create_rating(rating: schemas.RatingCreate, db: Session = Depends(get_db)):
    # Check if movie exists
    movie = crud.get_movie(db, rating.movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    # Check if rating already exists for this user and movie
    user_ratings = crud.get_user_ratings(db)
    existing_rating = next(
        (r for r in user_ratings if r.movie_id == rating.movie_id), None
    )

    if existing_rating:
        return crud.update_rating(db, existing_rating.id, rating)
    else:
        return crud.create_rating(db, rating)


@app.get("/ratings/", response_model=List[schemas.Rating])
def read_ratings(db: Session = Depends(get_db)):
    return crud.get_user_ratings(db)


@app.get("/ratings/{movie_id}", response_model=List[schemas.Rating])
def get_ratings(movie_id: int, db: Session = Depends(get_db)):
    """Fetch all ratings for a specific movie."""
    return db.query(models.Rating).filter(models.Rating.movie_id == movie_id).all()


@app.get("/recommendations", response_model=schemas.MovieListResponse)
def get_recommendations(db: Session = Depends(get_db)):
    movie_ids = recommender.get_recommendations(1, db)
    movies = [crud.get_movie(db, movie_id) for movie_id in movie_ids]
    return {"results": [m for m in movies if m is not None]}


@app.get("/")
def read_root():
    return {"message": "Movie Recommendation API is running!"}
