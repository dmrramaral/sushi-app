import { useEffect, useState } from 'react';
import orderService from '../../../services/order.service';

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const statusOptions = [
        { value: 'pending', label: 'Pendente', color: 'yellow' },
        { value: 'confirmed', label: 'Confirmado', color: 'blue' },
        { value: 'preparing', label: 'Preparando', color: 'purple' },
        { value: 'delivering', label: 'Em Entrega', color: 'indigo' },
        { value: 'completed', label: 'Concluído', color: 'green' },
        { value: 'cancelled', label: 'Cancelado', color: 'red' }
    ];

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAllOrders(1, 100);
            console.log('📦 Backend retornou pedidos:', data);
            setOrders(data.orders || data || []);
        } catch (err) {
            // Se não houver rota de admin, tenta pegar os pedidos do usuário
            try {
                const data = await orderService.getMyOrders();
                setOrders(data.orders || data || []);
            } catch (err2) {
                setError('Erro ao carregar pedidos');
                console.error(err2);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            setSuccess('Status do pedido atualizado com sucesso!');
            loadOrders();
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao atualizar status do pedido');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este pedido?')) return;

        try {
            await orderService.deleteOrder(id);
            setSuccess('Pedido excluído com sucesso!');
            loadOrders();
            if (showDetailsModal) {
                setShowDetailsModal(false);
                setSelectedOrder(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao excluir pedido');
        }
    };

    const getStatusColor = (status) => {
        const statusObj = statusOptions.find(s => s.value === status);
        return statusObj?.color || 'gray';
    };

    const getStatusLabel = (status) => {
        const statusObj = statusOptions.find(s => s.value === status);
        return statusObj?.label || status;
    };

    const filteredOrders = filterStatus === 'all' 
        ? orders 
        : orders.filter(order => order.status === filterStatus);

    const closeModal = () => {
        setShowDetailsModal(false);
        setSelectedOrder(null);
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
            {/* Header com filtros */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Gerenciar Pedidos</h2>
                    <p className="text-gray-600 mt-1">Total de {orders.length} pedidos</p>
                </div>
                
                <div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="all">Todos os Status</option>
                        {statusOptions.map(status => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>
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

            {/* Tabela de pedidos - Desktop */}
            <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pedido
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        #{order._id?.substring(0, 8)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {order.items?.length || 0} item(s)
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {order.user?.name || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {order.user?.email || ''}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        R$ {order.subtotal?.toFixed(2)}
                                    </div>
                                    {order.freight > 0 && (
                                        <div className="text-xs text-gray-500">
                                            + R$ {order.freight?.toFixed(2)} frete
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer
                                            ${getStatusColor(order.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${getStatusColor(order.status) === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                                            ${getStatusColor(order.status) === 'purple' ? 'bg-purple-100 text-purple-800' : ''}
                                            ${getStatusColor(order.status) === 'indigo' ? 'bg-indigo-100 text-indigo-800' : ''}
                                            ${getStatusColor(order.status) === 'green' ? 'bg-green-100 text-green-800' : ''}
                                            ${getStatusColor(order.status) === 'red' ? 'bg-red-100 text-red-800' : ''}
                                        `}
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleViewDetails(order)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        👁️ Ver
                                    </button>
                                    <button
                                        onClick={() => handleDelete(order._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        🗑️ Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        {filterStatus === 'all' 
                            ? 'Nenhum pedido encontrado' 
                            : `Nenhum pedido com status "${getStatusLabel(filterStatus)}"`
                        }
                    </div>
                )}
            </div>

            {/* Cards Mobile */}
            <div className="md:hidden space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        {filterStatus === 'all' 
                            ? 'Nenhum pedido encontrado' 
                            : `Nenhum pedido com status "${getStatusLabel(filterStatus)}"`
                        }
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
                            {/* Header do Card */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        Pedido #{order._id?.substring(0, 8)}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full
                                    ${getStatusColor(order.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    ${getStatusColor(order.status) === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                                    ${getStatusColor(order.status) === 'purple' ? 'bg-purple-100 text-purple-800' : ''}
                                    ${getStatusColor(order.status) === 'indigo' ? 'bg-indigo-100 text-indigo-800' : ''}
                                    ${getStatusColor(order.status) === 'green' ? 'bg-green-100 text-green-800' : ''}
                                    ${getStatusColor(order.status) === 'red' ? 'bg-red-100 text-red-800' : ''}
                                `}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>

                            {/* Info do Cliente */}
                            <div className="mb-3 pb-3 border-b border-gray-200">
                                <p className="text-sm font-medium text-gray-900">
                                    {order.user?.name || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {order.user?.email || ''}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {order.items?.length || 0} item(s)
                                </p>
                            </div>

                            {/* Total */}
                            <div className="mb-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Subtotal:</span>
                                    <span className="font-bold text-gray-900">
                                        R$ {order.subtotal?.toFixed(2)}
                                    </span>
                                </div>
                                {order.freight > 0 && (
                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                        <span>Frete:</span>
                                        <span>R$ {order.freight?.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Atualizar Status */}
                            <div className="mb-3">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Atualizar Status
                                </label>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Ações */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewDetails(order)}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                                >
                                    👁️ Ver Detalhes
                                </button>
                                <button
                                    onClick={() => handleDelete(order._id)}
                                    className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Detalhes */}
            {showDetailsModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Detalhes do Pedido #{selectedOrder._id?.substring(0, 8)}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Realizado em {new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR')} às {new Date(selectedOrder.createdAt).toLocaleTimeString('pt-BR')}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Status */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Status do Pedido</h4>
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full
                                                ${getStatusColor(selectedOrder.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${getStatusColor(selectedOrder.status) === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                                                ${getStatusColor(selectedOrder.status) === 'purple' ? 'bg-purple-100 text-purple-800' : ''}
                                                ${getStatusColor(selectedOrder.status) === 'indigo' ? 'bg-indigo-100 text-indigo-800' : ''}
                                                ${getStatusColor(selectedOrder.status) === 'green' ? 'bg-green-100 text-green-800' : ''}
                                                ${getStatusColor(selectedOrder.status) === 'red' ? 'bg-red-100 text-red-800' : ''}
                                            `}>
                                                {getStatusLabel(selectedOrder.status)}
                                            </span>
                                        </div>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status.value} value={status.value}>
                                                    {status.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Cliente */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">Informações do Cliente</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Nome</p>
                                            <p className="font-medium">{selectedOrder.user?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{selectedOrder.user?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Endereço de Entrega */}
                                {selectedOrder.shippingAddress && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-3">Endereço de Entrega</h4>
                                        <p className="text-sm">
                                            {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.number}
                                            {selectedOrder.shippingAddress.complement && ` - ${selectedOrder.shippingAddress.complement}`}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {selectedOrder.shippingAddress.neighborhood}, {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.state}
                                        </p>
                                        <p className="text-sm text-gray-600">CEP: {selectedOrder.shippingAddress.zipCode}</p>
                                    </div>
                                )}

                                {/* Produtos */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center bg-white p-3 rounded">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.product?.images}
                                                        alt={item.product?.name}
                                                        className="h-12 w-12 rounded object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{item.product?.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Quantidade: {item.quantity} x R$ {item.price?.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold">
                                                    R$ {(item.quantity * item.price).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Resumo Financeiro */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">Resumo Financeiro</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-medium">
                                                R$ {(selectedOrder.subtotal - (selectedOrder.freight || 0)).toFixed(2)}
                                            </span>
                                        </div>
                                        {selectedOrder.freight > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Frete:</span>
                                                <span className="font-medium">R$ {selectedOrder.freight?.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t border-gray-300">
                                            <span className="font-semibold text-lg">Total:</span>
                                            <span className="font-bold text-lg text-red-600">
                                                R$ {selectedOrder.total?.toFixed(2)}
                                            </span>
                                        </div>
                                        {selectedOrder.paymentMethod && (
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Forma de pagamento:</span>
                                                <span>{selectedOrder.paymentMethod}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Observações */}
                                {selectedOrder.notes && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-2">Observações</h4>
                                        <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Fechar
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedOrder._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Excluir Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersManagement;
