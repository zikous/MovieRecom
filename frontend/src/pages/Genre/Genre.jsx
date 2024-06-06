import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Genre.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function GenreList() {
  const [genres, setGenres] = useState([]);
  const [movieGenre, setMovieGenre] = useState([]);
  const { GenreId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const loader = useRef(null);

  useEffect(() => {
    getGenres();
    setCurrentPage(1); // Reset currentPage when GenreId changes
  }, [GenreId]);

  useEffect(() => {
    getData(currentPage);
  }, [currentPage, GenreId]); // Fetch data when currentPage or GenreId changes

  const getGenres = () => {
    axios
      .get('https://api.themoviedb.org/3/genre/movie/list?language=en', {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        },
      })
      .then((response) => setGenres(response.data.genres))
      .catch((error) => console.error(error));
  };

  const getData = (page) => {
    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}&with_genres=${GenreId}&without_genres=0`,
        {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
          },
        }
      )
      .then((response) => {
        if (page === 1) {
          setMovieGenre(response.data.results); // Reset movieGenre on first page
        } else {
          setMovieGenre((prevMovies) => [
            ...prevMovies,
            ...response.data.results,
          ]); // Append to existing movieGenre
        }
        setTotalPages(response.data.total_pages);
      })
      .catch((error) => console.error(error));
  };

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    },
    [currentPage, totalPages]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [handleObserver]);

  const getGenreName = () => {
    const genre = genres.find((genre) => genre.id === parseInt(GenreId));
    return genre ? genre.name : '';
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  return (
    <div className="Popular">
      <h1>{getGenreName()} Movies</h1>
      <div className="movie-grid">
        {movieGenre.map((movie) => (
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
}

export default GenreList;
