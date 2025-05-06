import { API_BASE_URL } from "./env";
import type { Movie } from "./types";

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch(`${API_BASE_URL}/movies/`);
  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }
  const data = await response.json();
  return data.results;
}

export async function getMovie(id: number): Promise<Movie> {
  const response = await fetch(`${API_BASE_URL}/movies/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch movie");
  }
  return await response.json();
}

export async function getRecommendations(): Promise<Movie[]> {
  const response = await fetch(`${API_BASE_URL}/recommendations`);
  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }
  const data = await response.json();
  return data.results;
}

export async function getMovieCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/movies/categories/`);
  if (!response.ok) {
    throw new Error("Failed to fetch movie categories");
  }
  const data = await response.json();
  return data.categories;
}

export async function fetchMoviesByCategory(
  category: string
): Promise<Movie[]> {
  const response = await fetch(`${API_BASE_URL}/movies/?category=${category}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch movies for category: ${category}`);
  }
  const data = await response.json();
  return data.results;
}

export async function submitRating(
  movieId: number,
  rating: number
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/ratings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movie_id: movieId,
      rating: rating,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to submit rating");
  }
  await response.json();
}

export async function getUserRatings(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/ratings/`);
  if (!response.ok) {
    throw new Error("Failed to fetch user ratings");
  }
  const data = await response.json();
  return data;
}

export async function fetchUserRating(movieId: number): Promise<number | null> {
  const response = await fetch(`${API_BASE_URL}/ratings/${movieId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user rating");
  }
  const ratings = await response.json();
  return ratings.length > 0 ? ratings[0].rating : null;
}
