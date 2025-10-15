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
                <h2 className="text-2xl font-bold text-gray-900">Gerenciar Clientes</h2>
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
                                        {customer.admin ? '👑 Admin' : '👤 Cliente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleViewDetails(customer)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        👁️ Ver
                                    </button>
                                    {!customer.admin && (
                                        <button
                                            onClick={() => handleDelete(customer._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            🗑️ Excluir
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

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
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Nome</p>
                                            <p className="font-medium">{selectedCustomer.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{selectedCustomer.email}</p>
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

                            <div className="flex justify-end mt-6">
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
            )}
        </div>
    );
};

export default CustomersManagement;
