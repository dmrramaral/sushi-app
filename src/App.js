
import { Route, Routes } from 'react-router-dom';
import './App.css';
import NavMenu from './components/NavMenu/index';
import Home from './pages/home/index';
import Login from './pages/login/index';
import NotFound from './pages/notFound';
import Register from './pages/register/index';

function App() {
  return (
    <div className="app-container">
      <NavMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cardapio" element={<h1 style={{ padding: '100px 20px', textAlign: 'center' }}>Página do Cardápio em construção</h1>} />
        <Route path="/sobre" element={<h1 style={{ padding: '100px 20px', textAlign: 'center' }}>Página Sobre em construção</h1>} />
        <Route path="/contato" element={<h1 style={{ padding: '100px 20px', textAlign: 'center' }}>Página de Contato em construção</h1>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
  );
}

export default App;
