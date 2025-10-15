import api from './api';

class UserService {
    /**
     * Busca todos os usuários (Admin)
     * @param {number} page - Número da página
     * @param {number} limit - Limite de usuários por página
     * @returns {Promise} - Lista de usuários
     */
    async getAllUsers(page = 1, limit = 10) {
        const response = await api.get('/user', {
            params: { page, limit }
        });
        return response.data;
    }

    /**
     * Busca um usuário por ID (Admin)
     * @param {string} id - ID do usuário
     * @returns {Promise} - Dados do usuário
     */
    async getUserById(id) {
        const response = await api.get(`/user/${id}`);
        return response.data;
    }

    /**
     * Atualiza um usuário (Admin)
     * @param {string} id - ID do usuário
     * @param {object} userData - Dados atualizados
     * @returns {Promise} - Usuário atualizado
     */
    async updateUser(id, userData) {
        const response = await api.put(`/user/${id}`, userData);
        return response.data;
    }

    /**
     * Deleta um usuário (Admin)
     * @param {string} id - ID do usuário
     * @returns {Promise}
     */
    async deleteUser(id) {
        const response = await api.delete(`/user/${id}`);
        return response.data;
    }
}

const userService = new UserService();
export default userService;
