// src/pages/MovieDetail/MovieDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const movieOptions = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${id}`,
        params: {
          language: 'en-US',
        },
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        }
      };

      const creditsOptions = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${id}/credits`,
        params: {
          language: 'en-US',
        },
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        }
      };

      try {
        const [movieResponse, creditsResponse] = await Promise.all([
          axios.request(movieOptions),
          axios.request(creditsOptions)
        ]);
        setMovie(movieResponse.data);
        setCredits(creditsResponse.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie || !credits) {
    return <div>Loading...</div>;
  }

  const director = credits.crew.find((member) => member.job === 'Director');
  const cast = credits.cast.slice(0, 5); // Get the first 5 actors

  return (
    <div
      className="movie-detail"
      style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})` }}
    >
      <div className="movie-detail-content">
        <div className="movie-poster">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        </div>
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          {director && <p><strong>Director:</strong> {director.name}</p>}
          <p><strong>Cast:</strong> {cast.map((actor) => actor.name).join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
