import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const CartPage = () => {
  const { items, totalItems, totalPrice, loading, error, removeItem, updateQuantity, confirmOrder } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const frete = useMemo(()=> (items.length > 0 ? 20 : 0), [items]);
  const total = totalPrice + frete;

  const formatPrice = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (items.length === 0) return;
    setProcessing(true);
    setMessage('');
    const res = await confirmOrder({ paymentMethod });
    setProcessing(false);
    if (res.success) {
      setMessage('Pedido confirmado com sucesso!');
      setTimeout(()=> navigate('/meus-pedidos'), 1200);
    } else {
      setMessage(res.error || 'Erro ao confirmar pedido');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Meu Carrinho</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
      {message && <div className={`mb-4 p-3 rounded text-sm ${message.includes('sucesso') ? 'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'}`}>{message}</div>}

      {loading && <div className="text-gray-600 mb-4">Carregando...</div>}

      {items.length === 0 && !loading && (
        <div className="text-gray-500">Seu carrinho está vazio.</div>
      )}

      {items.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.productId} className="flex gap-4 p-4 border rounded-lg bg-white shadow-sm">
                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {item.product?.images && item.product.images[0] ? (
                    <img src={item.product.images[0]} alt={item.product?.name} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-xs text-gray-400">Sem imagem</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{item.product?.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.product?.description}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-green-600">{formatPrice((item.product?.price || 0))}</span>
                    <span className="text-gray-500">Subtotal: {formatPrice((item.product?.price || 0) * item.quantity)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Quantidade:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded text-sm flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="font-semibold text-gray-800 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 bg-green-500 hover:bg-green-600 text-white rounded text-sm flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                </div>
                <button onClick={() => removeItem(item.productId)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remover</button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-4">Resumo</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Itens ({totalItems})</span><span>{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between"><span>Frete</span><span>{formatPrice(frete)}</span></div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2"><span>Total</span><span className="text-green-600">{formatPrice(total)}</span></div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
                <select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
                  <option value="pix">PIX</option>
                  <option value="cartao">Cartão</option>
                  <option value="dinheiro">Dinheiro</option>
                </select>
              </div>
              <button
                onClick={handleConfirm}
                disabled={processing || items.length === 0}
                className={`mt-4 w-full py-2 rounded font-semibold text-white transition-colors ${items.length===0 || processing ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {processing ? 'Processando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
