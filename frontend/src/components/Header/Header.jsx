import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/genre/movie/list?language=en',
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
            },
          }
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="Header-container">
      <div className="headerLeft">
        <Link to="/">
          <img
            className="header_icon"
            src="https://p1.hiclipart.com/preview/365/513/290/movie-logo-photographic-film-movie-camera-cinema-movie-projector-video-cameras-cinema-camera-circle-png-clipart.jpg"
            alt="Logo"
          />
        </Link>
        <Link to="/">
          <span>Home</span>
        </Link>
        <div
          className="dropdown"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <span className="menu-button">Genre</span>
          {isDropdownOpen && (
            <div className="dropdown-content">
              {genres.map((genre) => (
                <Link key={genre.id} to={`/genre/${genre.name.toLowerCase()}`}>
                  {genre.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link to="/popular">
          <span>Popular</span>
        </Link>
        <Link to="/toprated">
          <span>Top Rated</span>
        </Link>
        <Link to="/upcoming">
          <span>Upcoming</span>
        </Link>
        <Link to="/recommended">
          <span>Recommended</span>
        </Link>
      </div>
      <div className="headerRight">
        <div
          className={`search-bar ${isSearchOpen ? 'open' : ''}`}
          onMouseEnter={() => setSearchOpen(true)}
          onMouseLeave={() => setSearchOpen(false)}
        >
          <input type="text" placeholder="Search..." />
          <button type="submit">Search</button>
        </div>
        <button
          className="sign-in-button"
          onClick={() => {
            alert('Sign In clicked!');
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Header;
