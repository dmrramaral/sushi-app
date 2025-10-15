import api from './api';

class ProductService {
    /**
     * Busca todos os produtos com paginação
     * @param {number} page - Número da página
     * @param {number} limit - Limite de produtos por página
     * @returns {Promise} - Lista de produtos
     */
    async getAllProducts(page = 1, limit = 12) {
        const response = await api.get(`/product/products`, {
            params: { page, limit }
        });
        return response.data;
    }

    /**
     * Busca um produto por ID
     * @param {string} id - ID do produto
     * @returns {Promise} - Dados do produto
     */
    async getProductById(id) {
        const response = await api.get(`/product/products/${id}`);
        return response.data;
    }

    /**
     * Busca produtos por categoria
     * @param {string} categoryId - ID da categoria
     * @param {number} page - Número da página
     * @param {number} limit - Limite de produtos por página
     * @returns {Promise} - Lista de produtos da categoria
     */
    async getProductsByCategory(categoryId, page = 1, limit = 12) {
        const response = await api.get('/product/products', {
            params: { category: categoryId, page, limit }
        });
        return response.data;
    }

    /**
     * Busca produtos por termo de pesquisa
     * @param {string} searchTerm - Termo de pesquisa
     * @param {number} page - Número da página
     * @param {number} limit - Limite de produtos por página
     * @returns {Promise} - Lista de produtos encontrados
     */
    async searchProducts(searchTerm, page = 1, limit = 12) {
        const response = await api.get('/product/products/search', {
            params: { search: searchTerm, page, limit }
        });
        return response.data;
    }

    /**
     * Cria um novo produto (Admin)
     * @param {object} productData - Dados do produto
     * @returns {Promise} - Produto criado
     */
    async createProduct(productData) {
        const response = await api.post('/product/products/create', productData);
        return response.data;
    }

    /**
     * Atualiza um produto (Admin)
     * @param {string} id - ID do produto
     * @param {object} productData - Dados atualizados
     * @returns {Promise} - Produto atualizado
     */
    async updateProduct(id, productData) {
        const response = await api.put(`/product/products/${id}`, productData);
        return response.data;
    }

    /**
     * Deleta um produto (Admin)
     * @param {string} id - ID do produto
     * @returns {Promise}
     */
    async deleteProduct(id) {
        const response = await api.delete(`/product/products/${id}`);
        return response.data;
    }
}

const productService = new ProductService();
export default productService;
