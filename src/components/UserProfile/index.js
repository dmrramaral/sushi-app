import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
    const { user, isAuthenticated, logout, error, clearError } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded">
                Você precisa estar logado para ver o perfil.
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
            <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-2">
                    Perfil do Usuário
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                        <button 
                            onClick={clearError}
                            className="ml-2 text-sm underline"
                        >
                            Fechar
                        </button>
                    </div>
                )}

                <div className="mb-4">
                    <p className="text-gray-600 mb-2">
                        <strong>Email:</strong> {user?.email || 'Não disponível'}
                    </p>
                    <p className="text-gray-600 mb-2">
                        <strong>Status:</strong> 
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            Autenticado
                        </span>
                    </p>
                    <p className="text-gray-600 mb-4">
                        <strong>Token:</strong> 
                        <span className="ml-2 text-xs text-gray-500 font-mono">
                            {user?.token ? `${user.token.substring(0, 20)}...` : 'Não disponível'}
                        </span>
                    </p>
                </div>

                <button
                    onClick={logout}
                    className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                >
                    Fazer Logout
                </button>
            </div>
        </div>
    );
};

export default UserProfile;