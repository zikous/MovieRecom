from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
from . import models, crud


def get_recommendations(
    user_id: int, db: Session, n_recommendations: int = 5
) -> list[int]:
    """TF-IDF based recommender for single user"""
    # Get all movies
    movies = crud.get_movies(db)
    if not movies:
        return []

    movies_df = pd.DataFrame(
        [
            {
                "id": m.id,
                "title": m.title,
                "overview": m.overview or "",
                "genres": m.genres or "",
                "combined_text": f"{m.title} {m.overview or ''} {m.genres or ''}",
            }
            for m in movies
        ]
    )

    # Get user's liked movies (rating >= 3.5)
    user_ratings = crud.get_user_ratings(db, user_id)
    liked_movies = [r.movie_id for r in user_ratings if r.rating >= 3.5]

    if not liked_movies:
        # Fallback to popular movies if no ratings
        popular_movies = (
            db.query(models.Movie)
            .order_by(models.Movie.vote_average.desc())
            .limit(n_recommendations)
            .all()
        )
        return [m.id for m in popular_movies]

    # Create TF-IDF matrix
    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(movies_df["combined_text"])

    # Get average vector of liked movies
    liked_indices = movies_df[movies_df["id"].isin(liked_movies)].index
    liked_vectors = tfidf_matrix[liked_indices]
    avg_vector = liked_vectors.mean(axis=0)

    # Calculate cosine similarity
    cosine_sim = cosine_similarity(np.asarray(avg_vector), tfidf_matrix).flatten()

    # Get top recommendations excluding already liked movies
    movies_df["similarity"] = cosine_sim
    recommendations = (
        movies_df[~movies_df["id"].isin(liked_movies)]
        .sort_values("similarity", ascending=False)
        .head(n_recommendations)
    )

    return recommendations["id"].tolist()
