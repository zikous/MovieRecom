import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieItem from '../../components/MovieItem/MovieItem';
import './Recommendation.css'; // Add styles if necessary

const Recommendation = () => {
  const [movieIds, setMovieIds] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovieIds = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'http://localhost:8000/recommendations',
          params: { page: 1 },
        };
        const response = await axios.request(options);
        setMovieIds(response.data.results.map((movie) => movie.id));
      } catch (error) {
        console.error('Error fetching movie IDs:', error);
      }
    };

    fetchMovieIds();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviePromises = movieIds.map(async (id) => {
          const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/movie/${id}`,
            params: { language: 'en-US' },
            headers: {
              accept: 'application/json',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
            },
          };
          const response = await axios.request(options);
          return response.data;
        });

        const movieData = await Promise.all(moviePromises);
        setMovies(movieData);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    if (movieIds.length > 0) {
      fetchMovies();
    }
  }, [movieIds]);

  return (
    <div className="Popular">
      <h1>Recommended Movies</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieItem key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Recommendation;
