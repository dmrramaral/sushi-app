import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NavMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Usar o contexto de autenticação
  const { isAuthenticated, user, logout, loading, canAccessAdmin } = useAuth();
  console.log('User in NavMenu:', user); // Debug
  console.log('Can Access Admin:', canAccessAdmin && canAccessAdmin()); // Debug admin access

  const handleLoginRedirect = () => {
    console.log('Redirecionando para login...'); // Debug
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const handleProfileRedirect = () => {
    navigate('/perfil');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between max-w-7xl mx-auto py-4 px-5">
        <div className="flex items-center">
          <Link to="/" className="flex items-center no-underline">
            <img 
              src="https://img.freepik.com/premium-vector/sushi-logo-design_9845-32.jpg" 
              alt="Sushi House Logo" 
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="text-xl font-bold text-red-600">Sushi House</span>
          </Link>
        </div>

        <div 
          className="flex flex-col gap-1.5 cursor-pointer md:hidden z-[1001]"
          onClick={toggleMobileMenu}
        >
          <span className={`block w-6 h-0.5 bg-gray-800 rounded-full transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 rounded-full transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 rounded-full transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>

        <ul className={`fixed md:static top-0 ${mobileMenuOpen ? 'right-0' : '-right-full'} flex flex-col md:flex-row md:gap-6 bg-white w-[70%] md:w-auto h-screen md:h-auto py-20 px-8 md:p-0 shadow-lg md:shadow-none transition-all duration-300 ease-in-out md:flex z-[1000]`}>
          <li className="my-2.5 md:my-0"><Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-red-600 font-medium text-lg md:text-base block py-2.5 md:py-1 relative after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-0.5 after:bg-red-600 after:bottom-0 after:left-0 after:transition-all">Home</Link></li>
          <li className="my-2.5 md:my-0"><Link to="/cardapio" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-red-600 font-medium text-lg md:text-base block py-2.5 md:py-1 relative after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-0.5 after:bg-red-600 after:bottom-0 after:left-0 after:transition-all">Cardápio</Link></li>
          <li className="my-2.5 md:my-0"><Link to="/sobre" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-red-600 font-medium text-lg md:text-base block py-2.5 md:py-1 relative after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-0.5 after:bg-red-600 after:bottom-0 after:left-0 after:transition-all">Sobre</Link></li>
          <li className="my-2.5 md:my-0"><Link to="/contato" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-red-600 font-medium text-lg md:text-base block py-2.5 md:py-1 relative after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-0.5 after:bg-red-600 after:bottom-0 after:left-0 after:transition-all">Contato</Link></li>
          
          {/* Menu mobile - opções de autenticação */}
          <div className="md:hidden mt-8 pt-4 border-t border-gray-200">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">Olá, {user?.email?.split('@')[0] || 'Usuário'}</p>
                <button 
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors text-left"
                  onClick={handleProfileRedirect}
                >
                  Meu Perfil
                </button>
                {canAccessAdmin && canAccessAdmin() && (
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors text-left"
                    onClick={() => {
                      navigate('/admin');
                      setMobileMenuOpen(false);
                    }}
                  >
                    🛠️ Administração
                  </button>
                )}
                <button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors text-left"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button 
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors text-left"
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Cadastrar
                </button>
                <button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors text-left"
                  onClick={() => {
                    handleLoginRedirect();
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </ul>
        
        <div className="ml-5 hidden md:block">
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm">Olá, {user?.email?.split('@')[0] || 'Usuário'}</span>
              <button 
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded transition-colors text-sm"
                onClick={handleProfileRedirect}
              >
                Perfil
              </button>
              {canAccessAdmin && canAccessAdmin() && (
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded transition-colors text-sm"
                  onClick={() => navigate('/admin')}
                >
                  🛠️ Admin
                </button>
              )}
              <button 
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded transition-colors text-sm"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded transition-colors text-sm"
                onClick={() => navigate('/register')}
              >
                Cadastrar
              </button>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                onClick={handleLoginRedirect}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavMenu;
