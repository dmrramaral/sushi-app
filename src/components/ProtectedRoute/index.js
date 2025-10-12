import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Mostra loading enquanto verifica a autenticação
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Se requer autenticação mas o usuário não está autenticado
    if (requireAuth && !isAuthenticated) {
        // Redireciona para login e salva a localização atual
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Se não requer autenticação mas o usuário está autenticado (ex: página de login)
    if (!requireAuth && isAuthenticated) {
        // Redireciona para home ou para onde o usuário estava tentando ir
        const from = location.state?.from?.pathname || '/';
        return <Navigate to={from} replace />;
    }

    // Renderiza o componente filho
    return children;
};

export default ProtectedRoute;