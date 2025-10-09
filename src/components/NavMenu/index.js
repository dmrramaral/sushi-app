import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';

const NavMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="nav-menu">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            <img src="https://img.freepik.com/premium-vector/sushi-logo-design_9845-32.jpg" alt="Sushi House Logo" />
            <span>Sushi House</span>
          </Link>
        </div>

        <div className="hamburger" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
          <li><Link to="/cardapio" onClick={() => setMobileMenuOpen(false)}>Cardápio</Link></li>
          <li><Link to="/sobre" onClick={() => setMobileMenuOpen(false)}>Sobre</Link></li>
          <li><Link to="/contato" onClick={() => setMobileMenuOpen(false)}>Contato</Link></li>
        </ul>
        
        <div className="nav-login">
          <button className="login-button" onClick={handleLoginRedirect}>
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavMenu;
