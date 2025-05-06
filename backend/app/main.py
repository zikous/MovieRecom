from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import httpx
from typing import List

from . import models, schemas, crud, recommender
from .database import SessionLocal, engine, get_db
from .config import settings

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Movie Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

TMDB_API_KEY = settings.TMDB_API_KEY
TMDB_BASE_URL = settings.TMDB_BASE_URL
LANGUAGE = "en-US"
PAGE_LIMIT = 100
CATEGORIES = [
    ("movie/popular", "popular"),
    ("movie/top_rated", "top_rated"),
    ("movie/upcoming", "upcoming"),
]
PAGE_COUNT = 5


@app.post("/seed", response_model=schemas.MovieListResponse)
async def seed_database(db: Session = Depends(get_db)):
    seeded_movies = []

    for endpoint, category in CATEGORIES:
        count = 0
        for page in range(1, PAGE_COUNT + 1):
            if count >= PAGE_LIMIT:
                break
            try:
                data = await fetch_from_tmdb(endpoint, params={"page": page})
            except HTTPException:
                continue

            for movie in data["results"]:
                if count >= PAGE_LIMIT:
                    break
                movie_id = movie["id"]
                existing_movie = crud.get_movie(db, movie_id)
                if existing_movie:
                    crud.update_movie_categories(db, movie_id, category)
                    seeded_movies.append(existing_movie)
                    count += 1
                    continue

                try:
                    details = await fetch_from_tmdb(f"movie/{movie_id}")
                    genres = ", ".join([g["name"] for g in details.get("genres", [])])
                except HTTPException:
                    genres = ""

                movie_data = {
                    "id": movie_id,
                    "title": movie.get("title", ""),
                    "overview": movie.get("overview", ""),
                    "poster_path": movie.get("poster_path", ""),
                    "vote_average": movie.get("vote_average", 0.0),
                    "genres": genres,
                    "categories": category,
                }

                db_movie = crud.create_movie(db, schemas.MovieBase(**movie_data))
                seeded_movies.append(db_movie)
                count += 1

    return {"results": seeded_movies}


async def fetch_from_tmdb(endpoint: str, params: dict = None):
    headers = {
        "Authorization": f"Bearer {TMDB_API_KEY}",
        "Content-Type": "application/json;charset=utf-8",
    }
    params = params or {}
    params["language"] = LANGUAGE

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/{endpoint}", params=params, headers=headers
        )
        if response.status_code == 200:
            return response.json()
        raise HTTPException(status_code=response.status_code, detail="TMDB API error")


@app.get("/movies/", response_model=schemas.MovieListResponse)
def read_movies(
    skip: int = 0,
    limit: int = PAGE_LIMIT,
    category: str = None,
    db: Session = Depends(get_db),
):
    movies = crud.get_movies(db, skip=skip, limit=limit, category=category)
    return {"results": movies}


@app.get("/movies/categories/")
def get_movie_categories(db: Session = Depends(get_db)):
    movies = db.query(models.Movie).all()
    categories = set()
    for movie in movies:
        if movie.categories:
            for cat in movie.categories.split(","):
                categories.add(cat.strip())
    return {"categories": list(categories)}


@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def read_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = crud.get_movie(db, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


@app.post("/ratings/", response_model=schemas.Rating)
def create_rating(rating: schemas.RatingCreate, db: Session = Depends(get_db)):
    movie = crud.get_movie(db, rating.movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    existing_rating = crud.get_rating_by_movie(db, rating.movie_id)
    if existing_rating:
        return crud.update_rating(db, existing_rating.id, rating)
    return crud.create_rating(db, rating)


@app.get("/ratings/", response_model=List[schemas.Rating])
def read_ratings(db: Session = Depends(get_db)):
    return crud.get_ratings(db)


@app.get("/ratings/{movie_id}", response_model=List[schemas.Rating])
def get_ratings(movie_id: int, db: Session = Depends(get_db)):
    return db.query(models.Rating).filter(models.Rating.movie_id == movie_id).all()


@app.get("/recommendations", response_model=schemas.MovieListResponse)
def get_recommendations(
    n_recommendations: int = 10,
    db: Session = Depends(get_db),
):
    movie_ids = recommender.get_recommendations(db, n_recommendations)
    movies = [crud.get_movie(db, movie_id) for movie_id in movie_ids]
    return {"results": [m for m in movies if m is not None]}


@app.get("/")
def read_root():
    return {"message": "Movie Recommendation API is running!"}
