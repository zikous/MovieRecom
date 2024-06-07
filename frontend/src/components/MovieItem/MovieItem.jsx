// src/components/MovieItem/MovieItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './MovieItem.css';

const truncateDescription = (description, wordLimit) => {
  if (description) {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  }
  return '';
};

const MovieItem = ({ movie }) => {
  return (
    <div className="movie-item">
      <Link to={`/movie/${movie.id}`}>
        <div className="movie-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          <div className="movie-description">
            <h2>{movie.title}</h2>
            <p>{truncateDescription(movie.overview, 60)}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieItem;
