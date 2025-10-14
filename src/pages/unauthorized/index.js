import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                    <ShieldExclamationIcon className="h-20 w-20 text-red-500" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Acesso Negado
                </h1>
                
                <p className="text-gray-600 mb-6">
                    Você não tem permissão para acessar esta página.
                </p>
                
                <div className="space-y-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Voltar
                    </button>
                    
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Ir para Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
