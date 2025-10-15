import api from './api';

class CategoryService {
    /**
     * Busca todas as categorias
     * @returns {Promise} - Lista de categorias
     */
    async getAllCategories() {
        const response = await api.get('/category/categories');
        return response.data;
    }

    /**
     * Busca uma categoria por ID
     * @param {string} id - ID da categoria
     * @returns {Promise} - Dados da categoria
     */
    async getCategoryById(id) {
        const response = await api.get(`/category/categories/${id}`);
        return response.data;
    }

    /**
     * Cria uma nova categoria (admin apenas)
     * @param {Object} categoryData - Dados da categoria
     * @returns {Promise} - Categoria criada
     */
    async createCategory(categoryData) {
        const response = await api.post('/category/categories/create', categoryData);
        return response.data;
    }

    /**
     * Atualiza uma categoria (admin apenas)
     * @param {string} id - ID da categoria
     * @param {Object} categoryData - Dados atualizados
     * @returns {Promise} - Categoria atualizada
     */
    async updateCategory(id, categoryData) {
        const response = await api.put(`/category/categories/${id}`, categoryData);
        return response.data;
    }

    /**
     * Remove uma categoria (admin apenas)
     * @param {string} id - ID da categoria
     * @returns {Promise} - Resposta da remoção
     */
    async deleteCategory(id) {
        const response = await api.delete(`/category/categories/${id}`);
        return response.data;
    }
}

const categoryService = new CategoryService();
export default categoryService;