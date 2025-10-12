import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        </ul>
        
        <div className="ml-5 hidden md:block">
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={handleLoginRedirect}
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavMenu;
