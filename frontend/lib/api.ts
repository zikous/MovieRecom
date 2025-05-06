import { API_BASE_URL } from "./env";
import type { Movie } from "./types";

// Function to get all movies
export async function getMovies(): Promise<Movie[]> {
  // Uncomment this when ready to use the real API
  const response = await fetch(`${API_BASE_URL}/movies/`);
  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }
  const data = await response.json();
  return data.results;
}

// Function to get a single movie by ID
export async function getMovie(id: number): Promise<Movie> {
  // Uncomment this when ready to use the real API
  const response = await fetch(`${API_BASE_URL}/movies/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch movie");
  }
  return await response.json();
}

// Function to get recommendations
export async function getRecommendations(): Promise<Movie[]> {
  // Uncomment this when ready to use the real API
  const response = await fetch(`${API_BASE_URL}/recommendations`);
  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }
  const data = await response.json();
  return data.results;
}

// Function to fetch movies based on category
export async function fetchMoviesByCategory(
  category: string
): Promise<Movie[]> {
  if (category === "recommended") {
    return await getRecommendations();
  } else {
    return await getMovies();
  }
}

// Function to submit a rating
export async function submitRating(
  movieId: number,
  rating: number
): Promise<void> {
  // Uncomment this when ready to use the real API
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
  return await response.json();
}

// Function to get user ratings
export async function getUserRatings(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/ratings/`);
  if (!response.ok) {
    throw new Error("Failed to fetch user ratings");
  }
  const data = await response.json();
  return data;
}

// Function to fetch a user's rating for a specific movie
export async function fetchUserRating(movieId: number): Promise<number | null> {
  const response = await fetch(`${API_BASE_URL}/ratings/${movieId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user rating");
  }
  const ratings = await response.json();
  return ratings.length > 0 ? ratings[0].rating : null;
}
