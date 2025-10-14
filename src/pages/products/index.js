import { useCallback, useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import categoryService from '../../services/category.service';
import productService from '../../services/product.service';

/**
 * Página de listagem de produtos
 * - Faz fetch dos produtos ao montar
 * - Normaliza o formato da resposta (array direto ou { products: [] })
 * - Exibe estados de loading e erro
 * - Renderiza grade de ProductCard
 */
const ProductsPage = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [limit] = useState(12);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(1);

	const loadProducts = useCallback(async (pageNumber = 1, cat = selectedCategory) => {
		try {
			setLoading(true);
			setError(null);
			let data;
			if (cat) {
				console.log('Buscando produtos da categoria:', cat);
				data = await productService.getProductsByCategory(cat, pageNumber, limit);
			} else {
				console.log('Buscando todos os produtos');
				data = await productService.getAllProducts(pageNumber, limit);
			}
			console.log('Dados recebidos do backend:', data);
			// Agora backend retorna objeto { products, page, limit, total, totalPages }
			if (Array.isArray(data)) {
				console.log('Formato array antigo, produtos:', data);
				setProducts(data);
				setTotal(data.length);
				setTotalPages(1);
			} else {
				console.log('Formato novo objeto, produtos:', data.products);
				setProducts(data.products || []);
				setTotal(data.total ?? (data.products ? data.products.length : 0));
				setTotalPages(data.totalPages || 1);
			}
		} catch (err) {
			console.error('Falha ao carregar produtos', err);
			setError(err.message || 'Erro inesperado ao carregar produtos');
		} finally {
			setLoading(false);
		}
	}, [limit, selectedCategory]);

	useEffect(() => {
		loadProducts(page, selectedCategory);
	}, [loadProducts, page, selectedCategory]);

	// Carregar categorias uma vez
	useEffect(() => {
		(async () => {
			try {
				const cats = await categoryService.getAllCategories();
				setCategories(cats);
			} catch (e) {
				console.error('Erro ao carregar categorias', e);
			}
		})();
	}, []);

	const handleRetry = () => loadProducts(page, selectedCategory);

	const handleSelectCategory = (catId) => {
		setPage(1); // reset página
		setSelectedCategory(catId);
	};

	const handleClearCategory = () => {
		setPage(1);
		setSelectedCategory(null);
	};

	const handleNextPage = () => setPage(p => p + 1);
	const handlePrevPage = () => setPage(p => Math.max(1, p - 1));

	return (
		<div className="p-4 max-w-7xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Produtos</h1>

			{/* Filtros de categoria - Layout melhorado */}
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

			{loading && (
				<div className="text-gray-600">Carregando produtos...</div>
			)}

			{error && !loading && (
				<div className="bg-red-100 text-red-700 p-3 rounded mb-4">
					<p className="font-semibold mb-2">Erro ao carregar produtos:</p>
					<p className="text-sm mb-2">{error}</p>
					<button onClick={handleRetry} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">Tentar novamente</button>
				</div>
			)}

			{!loading && !error && products.length === 0 && (
				<div className="text-gray-600">Nenhum produto encontrado.</div>
			)}

			{!loading && !error && products.length > 0 && (
		<div>
					<div className="flex justify-between items-center mb-3 text-sm text-gray-700">
						<span>Total: {total}</span>
						<span>Página {page} de {totalPages}</span>
					</div>
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{products.map((prod, index) => {
							console.log(`Produto ${index}:`, prod);
							return <ProductCard key={prod._id || prod.id || index} product={prod} />;
						})}
					</div>
				</div>
			)}			{/* Controles de paginação simples (placeholders; backend ainda não retorna total) */}
			<div className="flex items-center gap-4 mt-6">
				<button
					onClick={handlePrevPage}
						disabled={page === 1 || loading}
						className="px-4 py-2 bg-gray-200 disabled:opacity-50 rounded hover:bg-gray-300 text-sm"
				>Anterior</button>
				<span className="text-sm">Página {page}</span>
				<button
					onClick={handleNextPage}
					disabled={loading || page >= totalPages}
					className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm"
				>Próxima</button>
			</div>
		</div>
	);
};

export default ProductsPage;

