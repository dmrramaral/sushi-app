import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptador para adicionar token automaticamente nas requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error instanceof Error ? error : new Error(error));
    }
);

// Interceptador para lidar com respostas e erros globalmente
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Se token expirou ou é inválido, fazer logout
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Redirecionar para login se necessário
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        // Retornar erro customizado
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Erro na requisição';
        
        return Promise.reject(new Error(errorMessage));
    }
);

export default api;