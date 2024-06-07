import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [genres, setGenres] = useState([]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Search submitted with query:', searchValue);
    navigate(`/search?q=${searchValue}`);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
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
  const tryMyLuck = async () => {
    // Generate a random movie ID within a reasonable range
    const randomMovieId = Math.floor(Math.random() * 10000) + 1; // Assuming movies IDs start from 1 and go up to 10000
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${randomMovieId}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        },
      }
    );
    if (response.ok) {
      navigate(`/movie/${randomMovieId}`);
    } else {
      alert("Sorry, you didn't have luck this time. Please try again.");
    }
  };

  return (
    <div className="Header-container">
      <div className="headerLeft">
        <Link to="/">
          <img
            className="header_icon"
            src="https://i.ibb.co/Ryw9pcf/png-transparent-logo-clapperboard-product-design-marketing-movie-tape-text-service-logo-removebg-pre.png"
            alt="Logo"
          />
        </Link>
        <Link to="/">
          <span>Home</span>
        </Link>
        <div className="dropdown" onClick={toggleDropdown}>
          <span className="menu-button">Genre</span>
          <div className={`dropdown-content ${isDropdownOpen ? 'open' : ''}`}>
            {genres.map((genre) => (
              <Link
                key={genre.id}
                to={`/genre/${genre.id}`}
                style={{ textDecoration: 'none' }}
              >
                {genre.name}
              </Link>
            ))}
          </div>
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
        <Link to="/recommendations">
          <span>Recommended</span>
        </Link>
      </div>
      <div className="headerRight">
        <div
          className={`search-bar ${isSearchOpen ? 'open' : ''}`}
          onMouseEnter={() => setSearchOpen(true)}
          onMouseLeave={() => setSearchOpen(false)}
          style={{ width: isSearchOpen ? '250px' : '80px' }}
        >
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                padding: '5px',
                fontSize: '16px',
                fontFamily: 'Roboto, sans-serif',
              }}
            />
            {isSearchOpen && <button type="submit">Search</button>}
          </form>
        </div>
        <button className="sign-in-button" onClick={tryMyLuck}>
          Try My Luck
        </button>
      </div>
    </div>
  );
};

export default Header;
