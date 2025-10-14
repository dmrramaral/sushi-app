import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

/**
 * Componente de Card de Produto
 * @param {Object} product - Dados do produto
 */
const ProductCard = ({ product, onAddToCart }) => {
    const { isAuthenticated } = useAuth();
    const { addItem, updateQuantity, items } = useCart();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Encontrar a quantidade atual no carrinho
    const currentQuantity = useMemo(() => {
        const cartItem = items.find(item => item.productId === product._id || item.product?._id === product._id);
        return cartItem ? cartItem.quantity : 0;
    }, [items, product._id]);

    // Função para formatar preço em Real
    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    // Renderiza estrelas de avaliação
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(
                    <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
                );
            } else {
                stars.push(
                    <StarIcon key={i} className="h-4 w-4 text-gray-300" />
                );
            }
        }
        return stars;
    };

    // Função para adicionar ao carrinho
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            setMessage('Você precisa estar logado para adicionar produtos ao carrinho');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await addItem(product._id, 1);
            setMessage('Produto adicionado ao carrinho!');
            
            // Chama callback se fornecido
            if (onAddToCart) {
                onAddToCart(product);
            }

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.message || 'Erro ao adicionar produto');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

        // Função para aumentar quantidade
        const handleIncrease = async () => {
            if (!isAuthenticated) {
                setMessage('Você precisa estar logado para adicionar produtos ao carrinho');
                setTimeout(() => setMessage(''), 3000);
                return;
            }

            setLoading(true);
            setMessage('');

            try {
                const newQuantity = currentQuantity + 1;
                if (currentQuantity === 0) {
                    await addItem(product._id, 1);
                } else {
                    await updateQuantity(product._id, newQuantity);
                }
                setMessage('Quantidade atualizada!');
                setTimeout(() => setMessage(''), 2000);
            } catch (error) {
                setMessage(error.message || 'Erro ao atualizar quantidade');
                setTimeout(() => setMessage(''), 3000);
            } finally {
                setLoading(false);
            }
        };

        // Função para diminuir quantidade
        const handleDecrease = async () => {
            if (!isAuthenticated || currentQuantity === 0) return;

            setLoading(true);
            setMessage('');

            try {
                const newQuantity = currentQuantity - 1;
                await updateQuantity(product._id, newQuantity);
                setMessage(newQuantity === 0 ? 'Produto removido do carrinho!' : 'Quantidade atualizada!');
                setTimeout(() => setMessage(''), 2000);
            } catch (error) {
                setMessage(error.message || 'Erro ao atualizar quantidade');
                setTimeout(() => setMessage(''), 3000);
            } finally {
                setLoading(false);
            }
        };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Imagem do Produto */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>Sem imagem</span>
                    </div>
                )}
                
                
            </div>

            {/* Informações do Produto */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                    {product.name}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                </p>

                {/* Avaliação */}
                {product.ratings > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                            {renderStars(Math.round(product.ratings))}
                        </div>
                        <span className="text-sm text-gray-600">
                            ({product.numReviews} {product.numReviews === 1 ? 'avaliação' : 'avaliações'})
                        </span>
                    </div>
                )}

                {/* Preço */}
                <div className="mb-3">
                    <span className="text-2xl font-bold text-green-600">
                        {formatPrice(product.price)}
                    </span>
                </div>

                {/* Mensagem de feedback */}
                {message && (
                    <div className={`mb-3 p-2 rounded text-sm text-center ${
                        message.includes('sucesso') || message.includes('adicionado')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Botão de adicionar ao carrinho - apenas para autenticados */}
                {isAuthenticated && (
                        <div className="space-y-2">
                            {currentQuantity === 0 ? (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={loading || product.stock === 0}
                                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors ${
                                        product.stock === 0
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : loading
                                            ? 'bg-blue-400 text-white cursor-wait'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    <ShoppingCartIcon className="h-5 w-5" />
                                    {loading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                                        <span className="text-sm font-medium text-green-700">
                                            {currentQuantity} no carrinho
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleDecrease}
                                                disabled={loading}
                                                className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <span className="font-semibold text-gray-800 min-w-[2rem] text-center">
                                                {currentQuantity}
                                            </span>
                                            <button
                                                onClick={handleIncrease}
                                                disabled={loading || product.stock <= currentQuantity}
                                                className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={loading || product.stock <= currentQuantity}
                                        className={`w-full flex items-center justify-center gap-2 py-1.5 px-4 rounded-lg font-medium text-sm transition-colors ${
                                            product.stock <= currentQuantity
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : loading
                                                ? 'bg-blue-400 text-white cursor-wait'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        <ShoppingCartIcon className="h-4 w-4" />
                                        {loading ? 'Adicionando...' : 'Adicionar +1'}
                                    </button>
                                </div>
                            )}
                        </div>
                )}

                {/* Mensagem para não autenticados */}
                {!isAuthenticated && (
                    <div className="text-center text-sm text-gray-500 mt-2">
                        Faça login para adicionar ao carrinho
                    </div>
                )}

              
            </div>
        </div>
    );
};

export default ProductCard;
