import React, { useState } from 'react';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import cartService from '../../services/cart.service';

/**
 * Componente de Card de Produto
 * @param {Object} product - Dados do produto
 */
const ProductCard = ({ product, onAddToCart }) => {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

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
            await cartService.addToCart(product._id, 1);
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
                
                {/* Badge de estoque */}
                {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Esgotado
                    </div>
                )}
                
                {product.stock > 0 && product.stock < 5 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Últimas unidades
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
                )}

                {/* Mensagem para não autenticados */}
                {!isAuthenticated && (
                    <div className="text-center text-sm text-gray-500 mt-2">
                        Faça login para adicionar ao carrinho
                    </div>
                )}

                {/* Estoque */}
                <div className="mt-2 text-sm text-gray-500 text-center">
                    {product.stock > 0 ? `${product.stock} em estoque` : 'Indisponível'}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
