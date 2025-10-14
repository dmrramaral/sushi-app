import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import categoryService from '../../services/category.service';
import productService from '../../services/product.service';

/**
 * Página do Cardápio - Menu de Produtos
 * Acesso público, mas botão de adicionar ao carrinho apenas para autenticados
 */
const Menu = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    // Buscar produtos (com opção de filtrar por categoria)
    const loadProducts = useCallback(async (category = null) => {
        try {
            setLoading(true);
            let data;
            
            if (category && category !== 'Todos') {
                data = await productService.getProductsByCategory(category, currentPage);
            } else {
                data = await productService.getAllProducts(currentPage);
            }
            
            setProducts(data.products);
            setTotalPages(data.totalPages);
            setTotalProducts(data.total || data.products.length);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            setError('Erro ao carregar produtos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [currentPage]);     const loadCategories = async () => {
            try {
                const response = await categoryService.getAllCategories();
                setCategories(response || []);
            } catch (err) {
                console.error('Erro ao carregar categorias:', err);
            }
        };

    // Carregar categorias uma vez
    useEffect(() => {
        loadCategories();
    }, []);

    // Buscar produtos quando mudar a página ou categoria
    useEffect(() => {
        loadProducts(selectedCategory);
    }, [currentPage, selectedCategory, loadProducts]);

    // Funções para manipular filtros de categoria
    const handleSelectCategory = (categoryId) => {
        setCurrentPage(1);
        setSelectedCategory(categoryId);
    };

    const handleClearCategory = () => {
        setCurrentPage(1);
        setSelectedCategory(null);
    };

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
                        {loading ? 'Carregando...' : (() => {
                            const produtoTexto = totalProducts === 1 ? 'prato encontrado' : 'pratos encontrados';
                            return `${totalProducts} ${produtoTexto}`;
                        })()}
                    </p>
                    
                    {/* Filtros de categoria */}
                    <div className="flex items-center gap-2">
                        <FunnelIcon className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-600">Categorias:</span>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={handleClearCategory}
                                className={`px-3 py-1 rounded-full text-sm transition-all ${
                                    !selectedCategory 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Todas
                            </button>
                            {categories.slice(0, 4).map(cat => (
                                <button
                                    key={cat._id}
                                    onClick={() => handleSelectCategory(cat._id)}
                                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                                        selectedCategory === cat._id 
                                            ? 'bg-red-500 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filtros de categoria - Seção completa */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Categorias</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <button
                            onClick={handleClearCategory}
                            className={`px-4 py-3 rounded-lg font-medium text-sm transition-all transform hover:scale-105 shadow-md ${
                                !selectedCategory 
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200' 
                                    : 'bg-white text-gray-700 hover:bg-red-50 border border-gray-200'
                            }`}
                        >
                            🍱 Todas
                        </button>
                        {categories.map(cat => {
                            // Ícones para diferentes categorias
                            const getCategoryIcon = (name) => {
                                const n = name?.toLowerCase() || '';
                                if (n.includes('sushi')) return '🍣';
                                if (n.includes('nigiri')) return '🐟';
                                if (n.includes('hot') || n.includes('quente')) return '🔥';
                                if (n.includes('temaki')) return '🌯';
                                if (n.includes('yakisoba')) return '🍜';
                                if (n.includes('bebida')) return '🥤';
                                if (n.includes('combo')) return '🍱'    ;
                                return '🍱';
                            };

                            return (
                                <button
                                    key={cat._id}
                                    onClick={() => {
                                        console.log('Clicando na categoria:', cat.name, 'ID:', cat._id);
                                        handleSelectCategory(cat._id);
                                    }}
                                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-all transform hover:scale-105 shadow-md ${
                                        selectedCategory === cat._id 
                                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200' 
                                            : 'bg-white text-gray-700 hover:bg-red-50 border border-gray-200'
                                    }`}
                                >
                                    {getCategoryIcon(cat.name)} {cat.name || 'Categoria'}
                                </button>
                            );
                        })}
                    </div>
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
