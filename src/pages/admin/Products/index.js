import { useEffect, useState } from 'react';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Form state (create/edit inline)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // null = creating
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: '',
        active: true
    });

    // Dados mockados para demonstração
    useEffect(() => {
        setLoading(true);
        // Simular carregamento de produtos
        setTimeout(() => {
            setProducts([
                {
                    id: 1,
                    name: 'Sushi Salmão',
                    description: 'Delicioso sushi de salmão fresco',
                    price: 25.90,
                    category: 'Sushi',
                    stock: 50,
                    image: 'https://via.placeholder.com/100x100',
                    active: true
                },
                {
                    id: 2,
                    name: 'Temaki Atum',
                    description: 'Temaki tradicional com atum',
                    price: 18.50,
                    category: 'Temaki',
                    stock: 30,
                    image: 'https://via.placeholder.com/100x100',
                    active: true
                },
                {
                    id: 3,
                    name: 'Hot Roll Filadélfia',
                    description: 'Hot roll com cream cheese e salmão',
                    price: 32.00,
                    category: 'Hot Roll',
                    stock: 25,
                    image: 'https://via.placeholder.com/100x100',
                    active: false
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const categories = ['Sushi', 'Temaki', 'Hot Roll', 'Sashimi', 'Combinados'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleToggleActive = (productId) => {
        setProducts(prev => prev.map(product => 
            product.id === productId 
                ? { ...product, active: !product.active }
                : product
        ));
    };

    const handleDelete = (productId) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            setProducts(prev => prev.filter(product => product.id !== productId));
        }
    };

    // Handlers para o formulário inline/modal
    const openCreateForm = () => {
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', category: '', stock: '', image: '', active: true });
        setIsFormOpen(true);
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            description: product.description || '',
            price: String(product.price ?? ''),
            category: product.category || '',
            stock: String(product.stock ?? ''),
            image: product.image || '',
            active: Boolean(product.active)
        });
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Conversões básicas
        const parsedPrice = formData.price === '' ? 0 : parseFloat(formData.price);
        const parsedStock = formData.stock === '' ? 0 : parseInt(formData.stock, 10);

        if (editingProduct) {
            // Atualizar
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
                ...p,
                name: formData.name,
                description: formData.description,
                price: isNaN(parsedPrice) ? 0 : parsedPrice,
                category: formData.category,
                stock: isNaN(parsedStock) ? 0 : parsedStock,
                image: formData.image,
                active: formData.active
            } : p));
        } else {
            // Criar (mock id)
            const nextId = (products.length ? Math.max(...products.map(p => p.id)) : 0) + 1;
            setProducts(prev => ([...prev, {
                id: nextId,
                name: formData.name,
                description: formData.description,
                price: isNaN(parsedPrice) ? 0 : parsedPrice,
                category: formData.category,
                stock: isNaN(parsedStock) ? 0 : parsedStock,
                image: formData.image || 'https://via.placeholder.com/100x100',
                active: formData.active
            }]));
        }
        setIsFormOpen(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Produtos</h1>
                        <p className="text-gray-600 mt-1">Gerencie todos os produtos do seu restaurante</p>
                    </div>
                    <button
                        onClick={openCreateForm}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Novo Produto
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar Produto
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Digite o nome ou descrição..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoria
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">Todas as Categorias</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('');
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">
                        Produtos ({filteredProducts.length})
                    </h3>
                </div>
                
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m4 8v4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || selectedCategory 
                                ? 'Tente alterar os filtros de busca.' 
                                : 'Comece criando seu primeiro produto.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Produto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categoria
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Preço
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estoque
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="relative px-6 py-3">
                                        <span className="sr-only">Ações</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                                        {product.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`${product.stock <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                                                {product.stock} un.
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                product.active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openEditForm(product)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(product.id)}
                                                    className={`${
                                                        product.active 
                                                            ? 'text-yellow-600 hover:text-yellow-900' 
                                                            : 'text-green-600 hover:text-green-900'
                                                    }`}
                                                >
                                                    {product.active ? 'Desativar' : 'Ativar'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de Formulário (Criar/Editar) */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black bg-opacity-40" onClick={closeForm} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
                            <button onClick={closeForm} className="text-gray-600 hover:text-gray-900">✕</button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: Sushi de Salmão" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                            <textarea name="description" value={formData.description} onChange={handleFormChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Descreva o produto..." />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                                                <input type="number" name="price" value={formData.price} onChange={handleFormChange} step="0.01" min="0" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="0,00" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                                                <select name="category" value={formData.category} onChange={handleFormChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                                                    <option value="">Selecione uma categoria</option>
                                                    {categories.map(category => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade em Estoque</label>
                                            <input type="number" name="stock" value={formData.stock} onChange={handleFormChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="0" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                                            <input type="url" name="image" value={formData.image} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="https://exemplo.com/imagem.jpg" />
                                        </div>
                                        <div>
                                            <label className="flex items-center">
                                                <input type="checkbox" name="active" checked={formData.active} onChange={handleFormChange} className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                                                <span className="ml-2 text-sm text-gray-700">Produto ativo (disponível no cardápio)</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* Preview */}
                                <div>
                                    <div className="bg-gray-50 rounded-lg p-4 h-full">
                                        <h4 className="text-sm font-medium mb-3">Preview</h4>
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-40 object-cover rounded mb-3" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Imagem+não+encontrada'; }} />
                                        ) : (
                                            <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">Adicione uma imagem</div>
                                        )}
                                        <div className="text-sm text-gray-700">
                                            <p className="font-medium">{formData.name || 'Nome do produto'}</p>
                                            <p className="text-xs">{formData.description || 'Descrição do produto'}</p>
                                            <p className="font-semibold text-red-600 mt-2">R$ {formData.price || '0,00'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={closeForm} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">{editingProduct ? 'Atualizar' : 'Criar'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;