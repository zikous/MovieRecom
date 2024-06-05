import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './Home.css';
import axios from 'axios';
 
function Home() {
  const [movieName, setMovieName] = useState("");
  const [movies, setMovies] = useState([]);
 
  useEffect(() => {
    const fetchMovies = async () => {
      if (movieName.trim() === "") {
        setMovies([]);
        return;
      }
 
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo' // Replace with your actual API key
        }
      };
 
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${movieName}`, options);
        setMovies(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };
 
    const delayDebounceFn = setTimeout(() => {
      fetchMovies();
    }, 500);
 
    return () => clearTimeout(delayDebounceFn);
  }, [movieName]);
 
  const uniqueMovies = Array.from(new Set(movies.map(movie => movie.title)))
    .map(title => {
      return movies.find(movie => movie.title === title);
    });
 
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Movie Search Engine
        </p>
        <input
          className="movieName"
          placeholder="Search for a movie"
          value={movieName}
          onChange={(event) => setMovieName(event.target.value)}
        />
        <p>
          You Are Currently searching for : {movieName}:
        </p>
        <ul>
          {uniqueMovies.map(movie => (
            <li key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100px', height: '150px' }}
              />
              <p>{movie.title} ({movie.release_date})</p>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default Home;