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
}

const authService = new AuthService();
export default authService;