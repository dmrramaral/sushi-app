import { useEffect, useState } from 'react';
import userService from '../../../services/user.service';

const CustomersManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers(1, 100);
            setCustomers(data.users || []);
        } catch (err) {
            setError('Erro ao carregar clientes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (customer) => {
        try {
            const data = await userService.getUserById(customer._id);
            setSelectedCustomer(data);
            setShowDetailsModal(true);
        } catch (err) {
            setError('Erro ao carregar detalhes do cliente');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

        try {
            await userService.deleteUser(id);
            setSuccess('Cliente excluído com sucesso!');
            loadCustomers();
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao excluir cliente');
        }
    };

    const handleUpdateRole = async (customer, newRole) => {
        const roleNames = {
            'admin': 'Administrador',
            'manager': 'Gerente',
            'user': 'Usuário'
        };
        
        if (!window.confirm(`Tem certeza que deseja alterar o perfil de ${customer.name} para ${roleNames[newRole]}?`)) return;

        try {
            setError('');
            setSuccess('');
            
            // Atualiza tanto o campo 'role' quanto 'admin' para compatibilidade
            await userService.updateUser(customer._id, {
                role: newRole,
                admin: newRole === 'admin'
            });
            
            setSuccess(`${customer.name} agora é ${roleNames[newRole]}!`);
            
            loadCustomers();
            
            // Fechar modal de detalhes se estiver aberto
            if (showDetailsModal) {
                closeModal();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao alterar perfil do usuário');
            console.error('Erro ao alterar role:', err);
        }
    };

    const closeModal = () => {
        setShowDetailsModal(false);
        setSelectedCustomer(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Gerenciar Clientes</h2>
                <p className="text-gray-600 mt-1">Total de {customers.length} clientes cadastrados</p>
            </div>

            {/* Mensagens */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            {/* Tabela de clientes */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* Versão Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data de Cadastro
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                                <span className="text-red-600 font-semibold">
                                                    {customer.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{customer.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            customer.admin 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {customer.role === 'admin' && '👑 Admin'}
                                            {customer.role === 'manager' && '� Gerente'}
                                            {customer.role === 'user' && '�👤 Cliente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewDetails(customer)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                👁️ Ver
                                            </button>
                                            <select
                                                value={customer.role || 'user'}
                                                onChange={(e) => handleUpdateRole(customer, e.target.value)}
                                                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="user">👤 Usuário</option>
                                                <option value="manager">📊 Gerente</option>
                                                <option value="admin">� Admin</option>
                                            </select>
                                            {customer.role === 'user' && (
                                                <button
                                                    onClick={() => handleDelete(customer._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    🗑️ Excluir
                                                </button>
                                            )}
                                        </div>
                                    </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>

                {/* Versão Mobile - Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                    {customers.map((customer) => (
                        <div key={customer._id} className="p-4 hover:bg-gray-50">
                            <div className="flex gap-3 items-start">
                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-red-600 font-semibold text-lg">
                                        {customer.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900 break-words">
                                        {customer.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 break-words mt-1">
                                        {customer.email}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            customer.admin 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {customer.role === 'admin' && '👑 Admin'}
                                            {customer.role === 'manager' && '� Gerente'}
                                            {customer.role === 'user' && '👤 Usuário'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewDetails(customer)}
                                                className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                                            >
                                                👁️ Ver Detalhes
                                            </button>
                                        </div>
                                        <select
                                            value={customer.role || 'user'}
                                            onChange={(e) => handleUpdateRole(customer, e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
                                        >
                                            <option value="user">👤 Usuário</option>
                                            <option value="manager">� Gerente</option>
                                            <option value="admin">👑 Administrador</option>
                                        </select>
                                        {customer.role === 'user' && (
                                            <button
                                                onClick={() => handleDelete(customer._id)}
                                                className="w-full px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                                            >
                                                🗑️ Excluir Cliente
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {customers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Nenhum cliente cadastrado
                    </div>
                )}
            </div>

            {/* Modal de Detalhes */}
            {showDetailsModal && selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Detalhes do Cliente
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Informações Básicas */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">Informações Básicas</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Nome</p>
                                            <p className="font-medium break-words">{selectedCustomer.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium break-words">{selectedCustomer.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Tipo de Conta</p>
                                            <p className="font-medium">
                                                {selectedCustomer.admin ? '👑 Administrador' : '👤 Cliente'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Cadastrado em</p>
                                            <p className="font-medium">
                                                {new Date(selectedCustomer.createdAt).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Endereços */}
                                {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-3">Endereços</h4>
                                        <div className="space-y-3">
                                            {selectedCustomer.addresses.map((address, index) => (
                                                <div key={index} className="bg-white p-3 rounded border border-gray-200">
                                                    <p className="text-sm">
                                                        {address.street}, {address.number}
                                                        {address.complement && ` - ${address.complement}`}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {address.neighborhood}, {address.city} - {address.state}
                                                    </p>
                                                    <p className="text-sm text-gray-600">CEP: {address.zipCode}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Produtos Favoritos */}
                                {selectedCustomer.favoriteProducts && selectedCustomer.favoriteProducts.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-3">Produtos Favoritos</h4>
                                        <p className="text-sm text-gray-600">
                                            {selectedCustomer.favoriteProducts.length} produto(s) favoritado(s)
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4 mt-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nível de Acesso
                                    </label>
                                    <select
                                        value={selectedCustomer.role || 'user'}
                                        onChange={(e) => handleUpdateRole(selectedCustomer, e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                                    >
                                        <option value="user">👤 Usuário</option>
                                        <option value="manager">📊 Gerente</option>
                                        <option value="admin">👑 Administrador</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomersManagement;
