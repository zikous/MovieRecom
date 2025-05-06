from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
from . import models, crud
from typing import List


def get_recommendations(
    db: Session,
    n_recommendations: int = 10,
    recent_weight_factor: float = 2.0,
) -> List[int]:
    """
    Recommend movies based on content similarity, prioritizing recent ratings.
    """
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
                "vote_average": m.vote_average or 0,
                "combined_text": f"{m.title} {m.overview or ''} {m.genres or ''}",
            }
            for m in movies
        ]
    )

    user_ratings = crud.get_user_ratings(db)
    if not user_ratings:
        return get_popular_recommendations(db, n_recommendations)

    user_ratings_df = pd.DataFrame(
        [
            {
                "movie_id": r.movie_id,
                "rating": r.rating,
                "order_weight": (i + 1) / len(user_ratings),
            }
            for i, r in enumerate(user_ratings)
            if r.rating > 0
        ]
    )

    return get_order_weighted_recommendations(
        movies_df, user_ratings_df, n_recommendations, recent_weight_factor
    )


def get_order_weighted_recommendations(
    movies_df: pd.DataFrame,
    user_ratings_df: pd.DataFrame,
    n_recs: int,
    recent_weight_factor: float,
) -> List[int]:
    rated_movies = pd.merge(
        user_ratings_df, movies_df, left_on="movie_id", right_on="id"
    )

    if rated_movies.empty:
        return []

    tfidf = TfidfVectorizer(
        stop_words="english", ngram_range=(1, 2), max_features=10000
    )
    tfidf_matrix = tfidf.fit_transform(movies_df["combined_text"])

    rated_indices = movies_df[movies_df["id"].isin(rated_movies["id"])].index
    rated_vectors = tfidf_matrix[rated_indices]

    ratings = rated_movies["rating"].values
    order_weights = rated_movies["order_weight"].values
    combined_weights = ((ratings - 1) / 4) * (
        1 + (recent_weight_factor - 1) * order_weights
    )

    avg_vector = np.average(rated_vectors.toarray(), axis=0, weights=combined_weights)

    cosine_sim = cosine_similarity(avg_vector.reshape(1, -1), tfidf_matrix).flatten()

    movies_df["content_score"] = cosine_sim
    recommendations = (
        movies_df[~movies_df["id"].isin(rated_movies["id"])]
        .sort_values("content_score", ascending=False)
        .head(n_recs)
    )

    return recommendations["id"].tolist()


def get_popular_recommendations(db: Session, n_recs: int) -> List[int]:
    popular_movies = (
        db.query(models.Movie)
        .filter(models.Movie.vote_average > 7.0)
        .order_by(models.Movie.vote_average.desc())
        .limit(n_recs)
        .all()
    )
    return [m.id for m in popular_movies]
