import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/product.service';

/**
 * Página do Cardápio - Menu de Produtos
 * Acesso público, mas botão de adicionar ao carrinho apenas para autenticados
 */
const Menu = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    // Função para carregar produtos
    const loadProducts = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await productService.getAllProducts(currentPage, 12);
            
            setProducts(response.results || []);
            setTotalPages(response.totalPages || 1);
            setTotalProducts(response.total || 0);
        } catch (err) {
            setError('Erro ao carregar o cardápio. Tente novamente mais tarde.');
            console.error('Erro ao carregar produtos:', err);
        } finally {
            setLoading(false);
        }
    };

    // Buscar produtos ao carregar a página e quando mudar a página
    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Função de busca
    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchTerm.trim()) {
            loadProducts();
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await productService.searchProducts(searchTerm, currentPage, 12);
            setProducts(response.results || []);
            setTotalPages(response.totalPages || 1);
            setTotalProducts(response.total || 0);
        } catch (err) {
            setError('Erro ao pesquisar produtos.');
            console.error('Erro na busca:', err);
        } finally {
            setLoading(false);
        }
    };

    // Limpar busca
    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
        loadProducts();
    };

    // Paginação
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header do Cardápio */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-center mb-4">
                        🍱 Cardápio - Restaurante Japonês
                    </h1>
                    <p className="text-center text-red-100 text-lg">
                        Explore nossos deliciosos pratos e especialidades
                    </p>
                </div>
            </div>

            {/* Barra de Busca */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar pratos, sushi, temaki..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                            Buscar
                        </button>
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Limpar
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Informação de resultados */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-600">
                        {loading 
                            ? 'Carregando...' 
                            : `${totalProducts} ${totalProducts === 1 ? 'prato encontrado' : 'pratos encontrados'}`
                        }
                    </p>
                    
                    {/* Futura implementação de filtros */}
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                        <FunnelIcon className="h-5 w-5" />
                        <span>Filtros</span>
                    </button>
                </div>

                {/* Mensagem de Erro */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
                    </div>
                )}

                {/* Grade de Produtos */}
                {!loading && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard 
                                key={product._id} 
                                product={product}
                                onAddToCart={(product) => {
                                    console.log('Produto adicionado:', product);
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Mensagem quando não há produtos */}
                {!loading && products.length === 0 && !error && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl">
                            {searchTerm 
                                ? 'Nenhum prato encontrado para sua busca.' 
                                : 'Nenhum prato disponível no momento.'}
                        </p>
                    </div>
                )}

                {/* Paginação */}
                {!loading && products.length > 0 && totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg ${
                                currentPage === 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                        >
                            Anterior
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, index) => {
                                const page = index + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 rounded-lg ${
                                            currentPage === page
                                                ? 'bg-red-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg ${
                                currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
