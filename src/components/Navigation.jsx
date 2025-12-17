import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <div className="nav-container-wrapper">
      <nav className="navbar p-3 glass-nav">
        <div className="nav-container">
          <div className="logo">
            <span className='fa-solid fa-bullhorn'></span>
            <span className="logo-text">AlertLanka</span>
          </div>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <span className='fa-solid fa-house'></span> Home
            </Link>
            <Link to="/location/colombo" className="nav-link">
              <span className='fa-solid fa-location-dot'></span> Location Details
            </Link>
            <Link to="/about" className="nav-link">
              <span className='fa-solid fa-circle-info'></span> About
            </Link>
          </div>
          
          <button className="emergency-badge">
            <span className='fa-solid fa-triangle-exclamation'></span> Emergency: 1990
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;