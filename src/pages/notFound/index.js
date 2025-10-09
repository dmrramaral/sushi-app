import { Link } from 'react-router-dom';
import './style.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1>404</h1>
      <p>Página não encontrada</p>
      <Link to="/" className="notfound-link">Voltar para a Home</Link>
    </div>
  );
};

export default NotFound;
