// src/pages/MovieDetail/MovieDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import StarRatings from 'react-star-ratings';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      const movieOptions = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${id}`,
        params: { language: 'en-US' },
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        },
      };

      const creditsOptions = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${id}/credits`,
        params: { language: 'en-US' },
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        },
      };

      const videosOptions = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${id}/videos`,
        params: { language: 'en-US' },
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        },
      };

      const similarMoviesOptions = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/${id}/similar`,
        params: { language: 'en-US' },
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        },
      };

      try {
        const [
          movieResponse,
          creditsResponse,
          videosResponse,
          similarMoviesResponse,
        ] = await Promise.all([
          axios.request(movieOptions),
          axios.request(creditsOptions),
          axios.request(videosOptions),
          axios.request(similarMoviesOptions),
        ]);
        setMovie(movieResponse.data);
        setCredits(creditsResponse.data);
        setVideos(videosResponse.data.results);
        const filteredSimilarMovies = similarMoviesResponse.data.results.filter(
          (similarMovie) => similarMovie.poster_path
        );
        setSimilarMovies(filteredSimilarMovies);
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
  const trailer = videos.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  const changeRating = async (newRating) => {
    setRating(newRating);
    console.log(`New rating is: ${newRating}`);

    try {
      await axios.post('http://localhost:8000/rating/rate', {
        id_user: 1,
        id_movie: id,
        rating: newRating,
      });
      console.log('Rating saved successfully');
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  };

  return (
    <div className="movie-detail">
      <div className="movie-detail-content">
        {trailer && (
          <div className="movie-trailer">
            <iframe
              width="100%"
              height="400px"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Trailer"
            ></iframe>
          </div>
        )}
        <div className="movie-info-container">
          <div className="movie-poster">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="movie-rating">
              <h3>Rate this movie:</h3>
              <StarRatings
                rating={rating}
                starRatedColor="gold"
                changeRating={changeRating}
                numberOfStars={5}
                name="rating"
                starDimension="25px"
                starSpacing="2px"
              />
            </div>
          </div>
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p>{movie.overview}</p>
            <div className="movie-details">
              <div>
                <p>
                  <strong>Release Date:</strong> {movie.release_date}
                </p>
                <p>
                  <strong>Duration:</strong> {movie.runtime} minutes
                </p>
                <p>
                  <strong>Genre:</strong>{' '}
                  {movie.genres.map((genre) => genre.name).join(', ')}
                </p>
                <p>
                  <strong>Cast:</strong>{' '}
                  {cast.map((actor) => actor.name).join(', ')}
                </p>
              </div>
              <div>
                {director && (
                  <p>
                    <strong>Director:</strong> {director.name}
                  </p>
                )}
                <p>
                  <strong>Country:</strong>{' '}
                  {movie.production_countries
                    .map((country) => country.name)
                    .join(', ')}
                </p>
                <p>
                  <strong>Production:</strong>{' '}
                  {movie.production_companies
                    .map((company) => company.name)
                    .join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="similar-movies">
        <h2>Similar Movies</h2>
        <div className="similar-movie-grid">
          {similarMovies.map((similarMovie) => (
            <Link
              to={`/movie/${similarMovie.id}`}
              key={similarMovie.id}
              className="similar-movie-item"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                alt={similarMovie.title}
              />
              <h3>{similarMovie.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
