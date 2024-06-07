import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';
import Popular from './pages/Popular/Popular';
import TopRated from './pages/Top Rated/TopRated';
import Upcoming from './pages/Upcoming/Upcoming';
import SearchResults from './components/SearchResults/SearchResults';
import GenreList from './pages/Genre/Genre';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import Recommendation from './pages/Recommendation/Recommendation'; // Import the Recommendation component

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="counter" element={<Counter />} />
        <Route path="users" element={<Users />} />
        <Route path="about" element={<About />} />
        <Route path="popular" element={<Popular />} />
        <Route path="toprated" element={<TopRated />} />
        <Route path="upcoming" element={<Upcoming />} />
        <Route path="recommendations" element={<Recommendation />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/genre/:GenreId" element={<GenreList />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
