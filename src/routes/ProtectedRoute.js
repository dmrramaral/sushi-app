import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente de rota protegida que verifica autenticação
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado se autenticado
 * @param {string[]} props.allowedRoles - Array de roles permitidas (opcional)
 * @param {string} props.redirectTo - Rota para redirecionar se não autenticado (padrão: /login)
 */
const ProtectedRoute = ({ 
    children, 
    allowedRoles = [], 
    redirectTo = '/login' 
}) => {
    const { isAuthenticated, loading, hasRole } = useAuth();

    // Exibe um loading enquanto verifica a autenticação
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    // Verifica se o usuário está autenticado
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    // Verifica se há restrição de roles e se o usuário possui a role necessária
    if (allowedRoles.length > 0) {
        const hasPermission = allowedRoles.some(role => hasRole(role));
        
        if (!hasPermission) {
            // Redireciona para página não autorizada ou home
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Renderiza o componente filho se todas as verificações passaram
    return <>{children}</>;
};

export default ProtectedRoute;