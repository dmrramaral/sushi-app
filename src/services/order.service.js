import api from './api';

class OrderService {
  /**
   * Cria pedido a partir do carrinho atual
   * @param {Object} orderData - Dados do pedido
   * @param {string} orderData.paymentMethod - Método de pagamento
   * @param {string} orderData.notes - Observações do pedido
   * @returns {Promise} Pedido criado
   */
  async createFromCart({ paymentMethod, notes } = {}) {
    const response = await api.post('/order/from-cart', { paymentMethod, notes });
    return response.data;
  }

  /**
   * Busca todos os pedidos do usuário autenticado
   * @returns {Promise} Lista de pedidos
   */
  async getMyOrders() {
    const response = await api.get('/order/my');
    return response.data;
  }

  /**
   * Busca um pedido específico do usuário
   * @param {string} id - ID do pedido
   * @returns {Promise} Dados do pedido
   */
  async getMyOrder(id) {
    const response = await api.get(`/order/my/${id}`);
    return response.data;
  }

  /**
   * Busca todos os pedidos (Admin)
   * @param {number} page - Número da página
   * @param {number} limit - Limite de pedidos por página
   * @returns {Promise} - Lista de pedidos
   */
  async getAllOrders(page = 1, limit = 10) {
    const response = await api.get('/order/all', {
      params: { page, limit }
    });
    return response.data;
  }

  /**
   * Atualiza status de um pedido (Admin)
   * @param {string} id - ID do pedido
   * @param {string} status - Novo status
   * @returns {Promise} - Pedido atualizado
   */
  async updateOrderStatus(id, status) {
    const response = await api.put(`/order/${id}/status`, { status });
    return response.data;
  }

  /**
   * Deleta um pedido (Admin)
   * @param {string} id - ID do pedido
   * @returns {Promise}
   */
  async deleteOrder(id) {
    const response = await api.delete(`/order/${id}`);
    return response.data;
  }
}

const orderService = new OrderService();
export default orderService;
