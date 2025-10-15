import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const NavMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Usar o contexto de autenticação
  const { isAuthenticated, user, logout, loading, canAccessAdmin } = useAuth();
  const { items: cartItems, totalItems, totalPrice, removeItem, refreshCart, updateQuantity } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated, refreshCart]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  console.log('User in NavMenu:', user); // Debug
  console.log('Can Access Admin:', canAccessAdmin && canAccessAdmin()); // Debug admin access

  const handleLoginRedirect = () => {
    console.log('Redirecionando para login...'); // Debug
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/'); // Redireciona para home após logout
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
         {/*  <li className="my-2.5 md:my-0"><Link to="/sobre" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-red-600 font-medium text-lg md:text-base block py-2.5 md:py-1 relative after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-0.5 after:bg-red-600 after:bottom-0 after:left-0 after:transition-all">Sobre</Link></li>
          <li className="my-2.5 md:my-0"><Link to="/contato" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-red-600 font-medium text-lg md:text-base block py-2.5 md:py-1 relative after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-0.5 after:bg-red-600 after:bottom-0 after:left-0 after:transition-all">Contato</Link></li>
           */}
          {/* Menu mobile - opções de autenticação */}
          <div className="md:hidden mt-8 pt-4 border-t border-gray-200">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">Olá, {user?.name || 'Usuário'}</p>
                
                {/* Carrinho e Pedidos - Mobile */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded transition-colors text-center relative"
                    onClick={() => {
                      navigate('/carrinho');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <ShoppingCartIcon className="h-5 w-5" />
                      <span className="text-sm">Carrinho</span>
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {totalItems}
                        </span>
                      )}
                    </div>
                  </button>
                  <button 
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-3 rounded transition-colors text-center"
                    onClick={() => {
                      navigate('/meus-pedidos');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm">📦</span>
                      <span className="text-sm">Pedidos</span>
                    </div>
                  </button>
                </div>

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
            <div className="flex items-center gap-4">
              {/* Carrinho */}
              <div className="relative" ref={cartRef}>
                <button
                  onClick={() => setCartOpen(o => !o)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Carrinho"
                >
                  <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
                {cartOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-2xl rounded-lg border border-gray-200 z-50 animate-fade-in">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800 text-sm">Meu Carrinho</h3>
                      <button onClick={() => setCartOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                      {cartItems.length === 0 && (
                        <div className="p-4 text-sm text-gray-500 text-center">Carrinho vazio</div>
                      )}
                      {cartItems.map(item => {
                        const price = item.product?.price || 0;
                        const line = price * item.quantity;
                        return (
                            <div key={item.productId} className="p-3">
                            <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                              {item.product?.images && item.product.images[0] ? (
                                <img src={item.product.images[0]} alt={item.product?.name} className="object-cover w-full h-full" />
                              ) : (
                                <span className="text-xs text-gray-400">Sem imagem</span>
                              )}
                            </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{item.product?.name || 'Produto'}</p>
                                    <p className="text-[11px] text-gray-500">R$ {price.toFixed(2)} cada</p>
                                    <p className="text-[11px] text-green-600 font-semibold">Subtotal: R$ {line.toFixed(2)}</p>
                                  </div>
                                  <button
                                    onClick={() => removeItem(item.productId)}
                                    className="h-6 w-6 text-gray-400 hover:text-red-600 flex items-center justify-center flex-shrink-0"
                                    title="Remover"
                                  >
                                    ×
                                  </button>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-600">Quantidade:</span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                      className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded text-xs flex items-center justify-center"
                                      title="Diminuir"
                                    >
                                      -
                                    </button>
                                    <span className="font-semibold text-gray-800 min-w-[1.5rem] text-center text-sm">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                      className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded text-xs flex items-center justify-center"
                                      title="Aumentar"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between mb-3 text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold text-green-600">R$ {totalPrice.toFixed(2)}</span>
                      </div>
                      <button
                        disabled={cartItems.length === 0}
                        className={`w-full py-2 rounded-md text-sm font-semibold transition-colors ${
                          cartItems.length === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                        onClick={() => { setCartOpen(false); navigate('/carrinho'); }}
                      >
                        Ver Carrinho
                      </button>
                      <button
                        className="w-full py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-200"
                        onClick={() => { setCartOpen(false); navigate('/meus-pedidos'); }}
                      >
                        Meus Pedidos
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
