import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const [searchResults, setSearchResults] = useState([]);
  const loader = useRef(null); // Define the loader ref

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  useEffect(() => {
    if (searchQuery) {
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/search/movie',
        params: {
          query: searchQuery,
          include_adult: 'false',
          language: 'en-US',
          page: '1',
        },
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        },
      };

      axios
        .request(options)
        .then(function (response) {
          setSearchResults(response.data.results);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [searchQuery]);

  return (
    <div className="movie__list">
      <h2>Search Results for : "{searchQuery}"</h2>
      <div className="movie-grid">
        {searchResults.map((movie) => (
          <div className="movie-item" key={movie.id}>
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
          </div>
        ))}
      </div>
      <div ref={loader} className="loader">
        <h2>Loading...</h2>
      </div>
    </div>
  );
};

export default SearchResults;
