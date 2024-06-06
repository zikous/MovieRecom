// src/pages/TopRated/TopRated.jsx
import './TopRated.css';
import axios from 'axios';
import { useEffect, useState, useRef, useCallback } from 'react';
import MovieItem from '../../components/MovieItem/MovieItem'; // Added this line

function TopRated() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const loader = useRef(null);

  useEffect(() => {
    const fetchMovies = (page) => {
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/top_rated',
        params: { language: 'en-US', page: page },
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
        }
      };

      axios
        .request(options)
        .then(function (response) {
          setMovies(prevMovies => [...prevMovies, ...response.data.results]);
          setTotalPages(response.data.total_pages);
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    fetchMovies(currentPage);
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
    <div className="TopRated">
      <h1>Top Rated Movies</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieItem key={movie.id} movie={movie} />  // Changed this line
        ))}
      </div>
      <div ref={loader} className="loader">
        <h2>Loading...</h2>
      </div>
    </div>
  );
}

export default TopRated;
