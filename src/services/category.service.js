import api from './api';

class CategoryService {
    /**
     * Busca todas as categorias
     * @returns {Promise} - Lista de categorias
     */
    async getAllCategories() {
        try {
            const response = await api.get('/category/categories');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            throw error;
        }
    }

    /**
     * Busca uma categoria por ID
     * @param {string} id - ID da categoria
     * @returns {Promise} - Dados da categoria
     */
    async getCategoryById(id) {
        try {
            const response = await api.get(`/category/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar categoria:', error);
            throw error;
        }
    }

    /**
     * Cria uma nova categoria (admin apenas)
     * @param {Object} categoryData - Dados da categoria
     * @returns {Promise} - Categoria criada
     */
    async createCategory(categoryData) {
        try {
            const response = await api.post('/category/categories', categoryData);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            throw error;
        }
    }

    /**
     * Atualiza uma categoria (admin apenas)
     * @param {string} id - ID da categoria
     * @param {Object} categoryData - Dados atualizados
     * @returns {Promise} - Categoria atualizada
     */
    async updateCategory(id, categoryData) {
        try {
            const response = await api.put(`/category/categories/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
            throw error;
        }
    }

    /**
     * Remove uma categoria (admin apenas)
     * @param {string} id - ID da categoria
     * @returns {Promise} - Resposta da remoção
     */
    async deleteCategory(id) {
        try {
            const response = await api.delete(`/category/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao remover categoria:', error);
            throw error;
        }
    }
}

const categoryService = new CategoryService();
export default categoryService;