import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
    const { user, isAuthenticated, loading, isAdmin, canAccessAdmin } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Acesso Negado</h1>
                    <p className="text-gray-600">Você precisa estar logado para ver esta página.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Meu Perfil</h1>
                    
                    {/* Informações básicas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Informações Pessoais</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">ID:</label>
                                    <p className="text-gray-800">{user._id || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nome:</label>
                                    <p className="text-gray-800">{user.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email:</label>
                                    <p className="text-gray-800">{user.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Role:</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                                        user.role === 'manager' ? 'bg-blue-100 text-blue-800' : 
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.role || 'user'}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Admin (Boolean):</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.admin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.admin ? 'Sim' : 'Não'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Permissões</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">É Admin:</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        isAdmin() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {isAdmin() ? 'Sim' : 'Não'}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Pode Acessar Admin:</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        canAccessAdmin() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {canAccessAdmin() ? 'Sim' : 'Não'}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Criado em:</label>
                                    <p className="text-gray-800">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Endereços */}
                    {user.addresses && user.addresses.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Endereços</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.addresses.map((address, index) => (
                                    <div key={address._id || index} className="border rounded-lg p-4">
                                        <div className="space-y-2">
                                            <p><span className="font-medium">Rua:</span> {address.street}</p>
                                            <p><span className="font-medium">Cidade:</span> {address.city}</p>
                                            <p><span className="font-medium">Estado:</span> {address.state}</p>
                                            <p><span className="font-medium">CEP:</span> {address.zipCode}</p>
                                            <p><span className="font-medium">País:</span> {address.country}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Produtos Favoritos */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Produtos Favoritos</h2>
                        {user.favoritesProducts && user.favoritesProducts.length > 0 ? (
                            <div className="text-gray-600">
                                <p>Você tem {user.favoritesProducts.length} produto(s) favorito(s)</p>
                            </div>
                        ) : (
                            <p className="text-gray-600">Nenhum produto favorito ainda.</p>
                        )}
                    </div>

                    {/* Debug Info */}
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Debug - Objeto Completo</h2>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            {JSON.stringify(user, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;