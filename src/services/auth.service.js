import api from './api';

class AuthService {
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { 
                email, 
                password 
            });

            const data = response.data;

            // Salvar token no localStorage
            localStorage.setItem('token', data.token);

            return data;
        } catch (error) {
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await api.post('/user/create', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    async getCurrentUser() {
        const token = this.getToken();
        if (!token) {
            return null;
        }

        try {
            const response = await api.get('/user/profile');
            return response.data.user; // Retorna apenas o objeto user da resposta
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            
            // Se o erro for de autorização, fazer logout
            if (error.message.includes('401') || error.message.includes('Token inválido')) {
                this.logout();
            }
            
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;