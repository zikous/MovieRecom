import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <div className="Header-container">
      <Link className="Link" to="/">
        Home
      </Link>
      <div>|</div>
      <Link className="Link" to="/counter">
        Counter
      </Link>
      <div>|</div>
      <Link className="Link" to="/users">
        Users
      </Link>
      <div>|</div>
      <Link className="Link" to="/about">
        About
      </Link>
      <div>|</div>
      <Link className="Link" to="/Popular">
        Popular
      </Link>
    </div>
  );
};

export default Header;
