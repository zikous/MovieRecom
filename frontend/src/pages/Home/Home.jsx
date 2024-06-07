import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Home.css';
import { initializeScrolling } from './appScroll'; // Import the scrolling function
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularCurrentPage, setPopularCurrentPage] = useState(1);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [upcomingCurrentPage, setUpcomingCurrentPage] = useState(1);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedCurrentPage, setTopRatedCurrentPage] = useState(1);
  const popularLoader = useRef(null);
  const upcomingLoader = useRef(null);
  const topRatedLoader = useRef(null);

  // Added Today
  const popularContainerRef = useRef(null);
  const upcomingContainerRef = useRef(null);
  const topRatedContainerRef = useRef(null);

  useEffect(() => {
    if (popularContainerRef.current) {
      const cleanup = initializeScrolling(popularContainerRef.current, 1, 50);
      return cleanup;
    }
  }, [popularContainerRef]);

  useEffect(() => {
    if (upcomingContainerRef.current) {
      const cleanup = initializeScrolling(upcomingContainerRef.current, 1, 50);
      return cleanup;
    }
  }, [upcomingContainerRef]);

  useEffect(() => {
    if (topRatedContainerRef.current) {
      const cleanup = initializeScrolling(topRatedContainerRef.current, 1, 50);
      return cleanup;
    }
  }, [topRatedContainerRef]);

  const fetchPopularMovies = (page) => {
    const options = {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/popular',
      params: { language: 'en-US', page: page },
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setPopularMovies((prevMovies) => [
          ...prevMovies,
          ...response.data.results.slice(0, 10), // Limiting to 10 movies
        ]);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const fetchUpcomingMovies = (page) => {
    const options = {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/upcoming',
      params: { language: 'en-US', page: page },
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setUpcomingMovies((prevMovies) => [
          ...prevMovies,
          ...response.data.results.slice(0, 10), // Limiting to 10 movies
        ]);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const fetchTopRatedMovies = (page) => {
    const options = {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/top_rated',
      params: { language: 'en-US', page: page },
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setTopRatedMovies((prevMovies) => [
          ...prevMovies,
          ...response.data.results.slice(0, 10), // Limiting to 10 movies
        ]);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchPopularMovies(popularCurrentPage);
    fetchUpcomingMovies(upcomingCurrentPage);
    fetchTopRatedMovies(topRatedCurrentPage);
  }, [popularCurrentPage, upcomingCurrentPage, topRatedCurrentPage]);

  const handlePopularObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPopularCurrentPage((prevPage) => prevPage + 1);
    }
  }, []);

  const handleUpcomingObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setUpcomingCurrentPage((prevPage) => prevPage + 1);
    }
  }, []);

  const handleTopRatedObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setTopRatedCurrentPage((prevPage) => prevPage + 1);
    }
  }, []);

  useEffect(() => {
    const popularOption = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    const popularObserver = new IntersectionObserver(
      handlePopularObserver,
      popularOption
    );
    if (popularLoader.current) popularObserver.observe(popularLoader.current);

    return () => popularObserver.disconnect();
  }, [handlePopularObserver]);

  useEffect(() => {
    const upcomingOption = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    const upcomingObserver = new IntersectionObserver(
      handleUpcomingObserver,
      upcomingOption
    );
    if (upcomingLoader.current)
      upcomingObserver.observe(upcomingLoader.current);

    return () => upcomingObserver.disconnect();
  }, [handleUpcomingObserver]);

  useEffect(() => {
    const topRatedOption = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    const topRatedObserver = new IntersectionObserver(
      handleTopRatedObserver,
      topRatedOption
    );
    if (topRatedLoader.current)
      topRatedObserver.observe(topRatedLoader.current);

    return () => topRatedObserver.disconnect();
  }, [handleTopRatedObserver]);

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };
  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselRef.current) {
      setTimeout(() => {
        carouselRef.current.moveTo(1);
      }, 500); // Delay to ensure the carousel is fully initialized
    }
  }, []);

  return (
    <>
      <div className="poster">
        <Carousel
          ref={carouselRef}
          showThumbs={false}
          autoPlay={true}
          interval={5000} // Adjust the interval between slides if needed
          infiniteLoop={true}
          transitionTime={500} // Adjust the transition time for sliding effect
          dynamicHeight={false} // Ensure consistent slide heights
          onClickItem={() => {}}
          onChange={() => {}}
          onSwipeStart={() => {}}
          onSwipeEnd={() => {}}
        >
          {popularMovies.slice(0, 10).map((movie) => (
            <Link
              key={movie.id}
              style={{ textDecoration: 'none', color: 'white' }}
              to={`/movie/${movie.id}`}
            >
              <div className="posterImage">
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.original_title}
                />
              </div>
              <div className="posterImage__overlay">
                <div className="posterImage__title">{movie.original_title}</div>
                <div className="posterImage__runtime">{movie.release_date}</div>
                <div className="posterImage__rating">
                  {movie.vote_average}
                  <i className="fas fa-star" />
                </div>
                <div className="posterImage__description">
                  {truncateDescription(movie.overview, 15)}
                </div>
              </div>
            </Link>
          ))}
        </Carousel>
      </div>

      <div className="popular-movies">
        <h2>Popular Movies</h2>
        <div className="movies-container" ref={popularContainerRef}>
          {/* Popular movies rendering */}
          {popularMovies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <Link to={`/movie/${movie.id}`}>
                <div className="movie-poster">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>
                <div className="movie-description">
                  <h3>{movie.title}</h3>
                  <p>{truncateDescription(movie.overview, 10)}</p>{' '}
                  {/* Truncate to 10 words */}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="upcoming-movies">
        <h2>Upcoming Movies</h2>
        <div className="movies-container" ref={upcomingContainerRef}>
          {/* Upcoming movies rendering */}
          {upcomingMovies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <Link to={`/movie/${movie.id}`}>
                <div className="movie-poster">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>
                <div className="movie-description">
                  <h3>{movie.title}</h3>
                  <p>{truncateDescription(movie.overview, 10)}</p>{' '}
                  {/* Truncate to 10 words */}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="top-rated-movies">
        <h2>Top Rated Movies</h2>
        <div className="movies-container" ref={topRatedContainerRef}>
          {topRatedMovies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <Link to={`/movie/${movie.id}`}>
                <div className="movie-poster">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>
                <div className="movie-description">
                  <h3>{movie.title}</h3>
                  <p>{truncateDescription(movie.overview, 10)}</p>{' '}
                  {/* Truncate to 10 words */}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
