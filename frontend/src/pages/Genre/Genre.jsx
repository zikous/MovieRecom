import React, { useEffect, useRef, useState } from 'react';
import './Genre.css';
import { useParams } from 'react-router-dom';

function GenreList() {
  const [movieGenre, setMovieGenre] = useState([]);
  const [genres, setGenres] = useState([]);
  const { GenreId } = useParams();
  const loader = useRef(null);
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYjNlNzg0ODkzMDUxMjRjYmQ3YjNiMmViZjMyZjNjNCIsInN1YiI6IjY0NzBhYjRhNzcwNzAwMDExOTI0OGZlYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-XX-u9jsBzlN_VSkOYDNyk11_AGkIqX1b3H1XK0_1YE',
    },
  };
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getData();
    getGenres();
  }, [GenreId, currentPage]);

  const getData = () => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${currentPage}&with_genres=${GenreId}&without_genres=0`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setMovieGenre((prevMovies) => [...prevMovies, ...response.results]);
      })
      .catch((err) => console.error(err));
  };

  const getGenres = () => {
    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
      .then((response) => response.json())
      .then((response) => setGenres(response.genres))
      .catch((err) => console.error(err));
  };

  const getGenreName = () => {
    const genre = genres.find((genre) => genre.id === parseInt(GenreId));

    return genre ? genre.name : '';
  };

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

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
