import api from './api';

class AuthService {
    /**
     * Realiza login do usuário
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise} Dados do usuário e token
     */
    async login(email, password) {
        const response = await api.post('/auth/login', { 
            email, 
            password 
        });

        const data = response.data;

        // Salvar token no localStorage
        localStorage.setItem('token', data.token);

        return data;
    }

    /**
     * Registra novo usuário
     * @param {Object} userData - Dados do usuário
     * @returns {Promise} Dados do usuário criado
     */
    async register(userData) {
        const response = await api.post('/user/create', userData);
        return response.data;
    }

    /**
     * Realiza logout do usuário
     */
    logout() {
        localStorage.removeItem('token');
    }

    /**
     * Retorna o token armazenado
     * @returns {string|null} Token de autenticação
     */
    getToken() {
        return localStorage.getItem('token');
    }

    /**
     * Verifica se usuário está autenticado
     * @returns {boolean} True se autenticado
     */
    isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Busca dados do usuário atual
     * @returns {Promise} Dados do usuário
     */
    async getCurrentUser() {
        const token = this.getToken();
        if (!token) {
            return null;
        }

        const response = await api.get('/user/profile');
        return response.data.user; // Retorna apenas o objeto user da resposta
    }
}

const authService = new AuthService();
export default authService;