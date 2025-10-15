import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, loading, canAccessAdmin } = useAuth();
    const location = useLocation();

    // Mostra loading enquanto verifica a autenticação
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            </div>
        );
    }

    // Se não está autenticado, redireciona para login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Se está autenticado mas não tem permissão de admin
    if (!canAccessAdmin()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-4">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Acesso Negado
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Você não tem permissão para acessar esta área. 
                        Entre em contato com o administrador se acredita que isso é um erro.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    // Se tem permissão, renderiza o componente filho
    return children;
};

export default AdminRoute;