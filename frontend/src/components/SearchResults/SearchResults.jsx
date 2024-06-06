import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const [searchResults, setSearchResults] = useState([]);
  const loader = useRef(null); // Define the loader ref
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Ensure setTotalPages is defined

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  const fetchMovies = (page) => {
    if (searchQuery) {
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/search/movie',
        params: {
          query: searchQuery,
          include_adult: 'false',
          language: 'en-US',
          page: page,
        },
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        }
      };

      axios
        .request(options)
        .then(function (response) {
          if (page === 1) {
            setSearchResults(response.data.results);
          } else {
            setSearchResults(prevMovies => [...prevMovies, ...response.data.results]);
          }
          setTotalPages(response.data.total_pages);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
      setSearchResults([]);
      fetchMovies(1);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchMovies(currentPage);
    }
  }, [currentPage]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [handleObserver]);

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
