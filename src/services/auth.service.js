const API_BASE_URL = 'http://localhost:3000/api';

class AuthService {
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha no login');
            }

            // Salvar token no localStorage
            localStorage.setItem('token', data.token);

            return data;
        } catch (error) {
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao criar usuário');
            }

            return data;
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
            const response = await fetch(`${API_BASE_URL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token inválido, fazer logout
                    this.logout();
                    throw new Error('Token inválido');
                }
                throw new Error('Erro ao buscar dados do usuário');
            }

            const data = await response.json();
            return data.user; // Retorna apenas o objeto user da resposta
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;