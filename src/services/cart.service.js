import api from './api';

class CartService {
    /**
     * Obtém o token de autenticação
     * @returns {string|null} - Token de autenticação
     */
    getToken() {
        return localStorage.getItem('token');
    }

    /**
     * Adiciona um produto ao carrinho
     * @param {string} productId - ID do produto
     * @param {number} quantity - Quantidade do produto
     * @returns {Promise} - Dados do carrinho atualizado
     */
    async addToCart(productId, quantity = 1) {
        try {
            const token = this.getToken();
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            const response = await api.post(`/cart/addProduct/${productId}`, { 
                quantity 
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error);
            throw error;
        }
    }

    /**
     * Busca o carrinho do usuário
     * @returns {Promise} - Dados do carrinho
     */
    async getCart() {
        try {
            const token = this.getToken();
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            const response = await api.get('/cart/findCart');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar carrinho:', error);
            throw error;
        }
    }

    /**
     * Remove um produto do carrinho
     * @param {string} productId - ID do produto
     * @returns {Promise} - Dados do carrinho atualizado
     */
    async removeFromCart(productId) {
        try {
            const token = this.getToken();
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            const response = await api.delete(`/cart/removeProduct/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao remover produto do carrinho:', error);
            throw error;
        }
    }
}

const cartService = new CartService();
export default cartService;
