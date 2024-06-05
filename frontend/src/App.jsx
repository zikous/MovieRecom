import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';
import Popular from './pages/Popular/Popular';
import TopRated from './pages/Top Rated/TopRated';
import Upcoming from './pages/Upcoming/Upcoming';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="counter" element={<Counter />} />
        <Route path="users" element={<Users />} />
        <Route path="about" element={<About />} />
        <Route path="Popular" element={<Popular />} />
        <Route path="TopRated" element={<TopRated />} />
        <Route path="Upcoming" element={<Upcoming />} />
      </Routes>
    </Layout>
  );
}

export default App;
