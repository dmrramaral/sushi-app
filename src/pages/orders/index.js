import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import orderService from '../../services/order.service';

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Erro ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated]);

  const formatDate = (d) => new Date(d).toLocaleString('pt-BR');
  const formatPrice = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (!isAuthenticated) {
    return <div className="max-w-4xl mx-auto p-4">Faça login para ver seus pedidos.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
      {loading && <div className="text-gray-600">Carregando...</div>}
      {!loading && orders.length === 0 && <div className="text-gray-500">Você ainda não tem pedidos.</div>}
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex flex-wrap justify-between gap-4 mb-2">
              <div>
                <h2 className="font-semibold text-gray-800">Pedido #{order._id.slice(-6)}</h2>
                <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm"><span className="font-medium">Status:</span> <span className="uppercase text-gray-700">{order.status}</span></p>
                <p className="text-sm"><span className="font-medium">Pagamento:</span> {order.paymentStatus}</p>
                <p className="font-semibold text-green-600">Total: {formatPrice(order.total || 0)}</p>
              </div>
            </div>
            <div className="divide-y text-sm">
              {order.items?.map(it => (
                <div key={it._id || it.product} className="py-2 flex justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{it.name}</p>
                    <p className="text-gray-500">Qtd: {it.quantity} x {formatPrice(it.price)} </p>
                  </div>
                  <div className="font-semibold text-gray-700">{formatPrice(it.subtotal)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
