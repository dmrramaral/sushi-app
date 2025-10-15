import api from './api';

/**
 * Serviço para operações administrativas
 */
class AdminService {
  // ==================== PRODUTOS ====================
  
  /**
   * Cria um novo produto (admin)
   * @param {Object} productData - Dados do produto
   * @returns {Promise} Produto criado
   */
  async createProduct(productData) {
    const response = await api.post('/product/products/create', productData);
    return response.data;
  }

  /**
   * Atualiza um produto (admin)
   * @param {string} id - ID do produto
   * @param {Object} productData - Dados atualizados
   * @returns {Promise} Produto atualizado
   */
  async updateProduct(id, productData) {
    const response = await api.put(`/product/products/${id}`, productData);
    return response.data;
  }

  /**
   * Remove um produto (admin)
   * @param {string} id - ID do produto
   * @returns {Promise} Resposta da remoção
   */
  async deleteProduct(id) {
    const response = await api.delete(`/product/products/${id}`);
    return response.data;
  }

  // ==================== CATEGORIAS ====================
  
  /**
   * Cria uma nova categoria (admin)
   * @param {Object} categoryData - Dados da categoria
   * @returns {Promise} Categoria criada
   */
  async createCategory(categoryData) {
    const response = await api.post('/category/categories/create', categoryData);
    return response.data;
  }

  /**
   * Atualiza uma categoria (admin)
   * @param {string} id - ID da categoria
   * @param {Object} categoryData - Dados atualizados
   * @returns {Promise} Categoria atualizada
   */
  async updateCategory(id, categoryData) {
    const response = await api.put(`/category/categories/${id}`, categoryData);
    return response.data;
  }

  /**
   * Remove uma categoria (admin)
   * @param {string} id - ID da categoria
   * @returns {Promise} Resposta da remoção
   */
  async deleteCategory(id) {
    const response = await api.delete(`/category/categories/${id}`);
    return response.data;
  }

  // ==================== USUÁRIOS/CLIENTES ====================
  
  /**
   * Busca todos os usuários (admin)
   * @param {Object} params - Parâmetros de paginação
   * @returns {Promise} Lista de usuários
   */
  async getAllUsers(params = {}) {
    const response = await api.get('/user', { params });
    return response.data;
  }

  /**
   * Busca um usuário por ID (admin)
   * @param {string} id - ID do usuário
   * @returns {Promise} Dados do usuário
   */
  async getUserById(id) {
    const response = await api.get(`/user/${id}`);
    return response.data;
  }

  /**
   * Atualiza um usuário (admin)
   * @param {string} id - ID do usuário
   * @param {Object} userData - Dados atualizados
   * @returns {Promise} Usuário atualizado
   */
  async updateUser(id, userData) {
    const response = await api.put(`/user/${id}`, userData);
    return response.data;
  }

  /**
   * Remove um usuário (admin)
   * @param {string} id - ID do usuário
   * @returns {Promise} Resposta da remoção
   */
  async deleteUser(id) {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  }

  // ==================== PEDIDOS ====================
  
  /**
   * Busca todos os pedidos (admin)
   * @param {Object} params - Parâmetros de filtro e paginação
   * @returns {Promise} Lista de pedidos
   */
  async getAllOrders(params = {}) {
    const response = await api.get('/order/my', { params });
    return response.data;
  }

  /**
   * Busca um pedido por ID (admin)
   * @param {string} id - ID do pedido
   * @returns {Promise} Dados do pedido
   */
  async getOrderById(id) {
    const response = await api.get(`/order/my/${id}`);
    return response.data;
  }

  /**
   * Atualiza status de um pedido (admin)
   * @param {string} id - ID do pedido
   * @param {string} status - Novo status
   * @returns {Promise} Pedido atualizado
   */
  async updateOrderStatus(id, status) {
    const response = await api.patch(`/order/${id}/status`, { status });
    return response.data;
  }

  /**
   * Remove um pedido (admin)
   * @param {string} id - ID do pedido
   * @returns {Promise} Resposta da remoção
   */
  async deleteOrder(id) {
    const response = await api.delete(`/order/${id}`);
    return response.data;
  }

  // ==================== ESTATÍSTICAS ====================
  
  /**
   * Busca estatísticas do dashboard (admin)
   * @returns {Promise} Estatísticas gerais
   */
  async getDashboardStats() {
    try {
      // Buscar dados de diferentes endpoints
      const [productsData, categoriesData, usersData, ordersData] = await Promise.all([
        api.get('/product/products', { params: { limit: 1 } }),
        api.get('/category/categories'),
        api.get('/user', { params: { limit: 1 } }),
        api.get('/order/all', { params: { limit: 100 } })
      ]);

      const products = productsData.data;
      const categories = categoriesData.data;
      const users = usersData.data;
      const orders = ordersData.data;

      // Calcular estatísticas
      const totalProducts = products.total || products.products?.length || 0;
      const totalCategories = Array.isArray(categories) ? categories.length : 0;
      const totalCustomers = users.total || users.users?.length || 0;
      
      const ordersList = orders.orders || orders || [];
      const totalOrders = ordersList.length;
      const pendingOrders = ordersList.filter(o => o.status === 'pending').length;
      
      // Calcular receita total
      const revenue = ordersList
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0);

      // Buscar pedidos recentes
      const recentOrders = ordersList
        .slice(0, 5)
        .map(order => ({
          id: order._id,
          customer: order.user?.name || 'Cliente',
          total: order.totalAmount || order.total || 0,
          status: order.status,
          date: order.createdAt
        }));

      return {
        totalProducts,
        totalCategories,
        totalCustomers,
        totalOrders,
        pendingOrders,
        revenue,
        recentOrders
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Retornar valores padrão em caso de erro
      return {
        totalProducts: 0,
        totalCategories: 0,
        totalCustomers: 0,
        totalOrders: 0,
        pendingOrders: 0,
        revenue: 0,
        recentOrders: []
      };
    }
  }
}

const adminService = new AdminService();
export default adminService;
