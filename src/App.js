
import { Route, Routes } from 'react-router-dom';
import NavMenu from './components/NavMenu/index';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/home/index';
import Login from './pages/login/index';
import NotFound from './pages/notFound';
import Register from './pages/register/index';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-[calc(100vh-70px)]">
        <NavMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="/cardapio" element={<h1 className="py-24 px-5 text-center">Página do Cardápio em construção</h1>} />
          <Route path="/sobre" element={<h1 className="py-24 px-5 text-center">Página Sobre em construção</h1>} />
          <Route path="/contato" element={<h1 className="py-24 px-5 text-center">Página de Contato em construção</h1>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
