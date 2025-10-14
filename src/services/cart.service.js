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

            // Backend espera array de produtos no formato [{ _id, quantity }]
            const response = await api.post('/cart/carts/products', { 
                products: [{ _id: productId, quantity }]
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

            const response = await api.get('/cart/cart');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar carrinho:', error);
            throw error;
        }
    }

    /**
     * Remove um produto do carrinho
     * @param {string} productId - ID do produto
     * @returns {Promise} - Dados do carrinho atualizado ou null se carrinho foi deletado
     */
    async removeFromCart(productId) {
        try {
            const token = this.getToken();
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            // Backend espera DELETE /cart/carts/products com body { productId }
            const response = await api.delete('/cart/carts/products', { data: { productId } });
            
            // Se status 204, carrinho foi deletado (vazio)
            if (response.status === 204) {
                return null;
            }
            
            return response.data;
        } catch (error) {
            console.error('Erro ao remover produto do carrinho:', error);
            throw error;
        }
    }

        /**
         * Atualiza quantidade específica de um produto no carrinho
         * @param {string} productId - ID do produto
         * @param {number} quantity - Nova quantidade (0 remove o produto)
         * @returns {Promise} - Dados do carrinho atualizado ou null se carrinho foi deletado
         */
        async updateQuantity(productId, quantity) {
            try {
                const token = this.getToken();
                if (!token) {
                    throw new Error('Usuário não autenticado');
                }

                // Backend espera PUT /cart/carts/products com body { productId, quantity }
                const response = await api.put('/cart/carts/products', { productId, quantity });
            
                // Se status 204, carrinho foi deletado (vazio)
                if (response.status === 204) {
                    return null;
                }
            
                return response.data;
            } catch (error) {
                console.error('Erro ao atualizar quantidade do produto:', error);
                throw error;
            }
        }
}

const cartService = new CartService();
export default cartService;
