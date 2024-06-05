// src/pages/Popular/Popular.jsx
import './Popular.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Popular() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = (page) => {
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/popular',
        params: { language: 'en-US', page: page },
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
        }
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          setMovies(response.data.results);
          setTotalPages(response.data.total_pages); // Update total pages from the response
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    fetchMovies(currentPage);
  }, [currentPage]);

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages && i <= 10; i++) { // Limiting to 10 pages for simplicity
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="Popular">
      <h1>Popular Movies</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div className="movie-item" key={movie.id}>
            <div className="movie-poster">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
              />
              <div className="movie-description">
                <h2>{movie.title}</h2>
                <p>{truncateDescription(movie.overview, 40)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {renderPagination()}
      </div>
    </div>
  );
}

export default Popular;
