// src/pages/Popular/Popular.jsx
import './Upcoming.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Upcoming() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {


const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/movie/upcoming',
  params: {language: 'en-US', page: '1'},
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
  })
  .catch(function (error) {
    console.error(error);
  });
  }, []);

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  return (
    <body>
    <div className="Upcoming">

      <h1>Upcoming Movies</h1>
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
    </div>
    </body>
  );
}

export default Upcoming;
