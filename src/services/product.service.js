import api from './api';

class ProductService {
    /**
     * Busca todos os produtos com paginação
     * @param {number} page - Número da página
     * @param {number} limit - Limite de produtos por página
     * @returns {Promise} - Lista de produtos
     */
    async getAllProducts(page = 1, limit = 12) {
        try {
            const response = await api.get(`/product/products`, {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    }

    /**
     * Busca um produto por ID
     * @param {string} id - ID do produto
     * @returns {Promise} - Dados do produto
     */
    async getProductById(id) {
        try {
            const response = await api.get(`/product/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            throw error;
        }
    }

    /**
     * Busca produtos por categoria
     * @param {string} categoryId - ID da categoria
     * @param {number} page - Número da página
     * @param {number} limit - Limite de produtos por página
     * @returns {Promise} - Lista de produtos da categoria
     */
    async getProductsByCategory(categoryId, page = 1, limit = 12) {
        try {
            const response = await api.get('/product/products', {
                params: { category: categoryId, page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produtos por categoria:', error);
            throw error;
        }
    }

    /**
     * Busca produtos por termo de pesquisa
     * @param {string} searchTerm - Termo de pesquisa
     * @param {number} page - Número da página
     * @param {number} limit - Limite de produtos por página
     * @returns {Promise} - Lista de produtos encontrados
     */
    async searchProducts(searchTerm, page = 1, limit = 12) {
        try {
            const response = await api.get('/product/products/search', {
                params: { search: searchTerm, page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao pesquisar produtos:', error);
            throw error;
        }
    }
}

const productService = new ProductService();
export default productService;
