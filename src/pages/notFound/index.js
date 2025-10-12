import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5 py-10">
      <h1 className="text-8xl text-red-600 mb-4">404</h1>
      <p className="text-2xl text-gray-800 mb-6">Página não encontrada</p>
      <Link to="/" className="inline-block bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-7 rounded-md transition-colors text-lg">
        Voltar para a Home
      </Link>
    </div>
  );
};

export default NotFound;
