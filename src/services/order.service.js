import api from './api';

class OrderService {
  async createFromCart({ paymentMethod, notes } = {}) {
    const response = await api.post('/order/from-cart', { paymentMethod, notes });
    return response.data;
  }

  async getMyOrders() {
    const response = await api.get('/order/my');
    return response.data;
  }

  async getMyOrder(id) {
    const response = await api.get(`/order/my/${id}`);
    return response.data;
  }
}

const orderService = new OrderService();
export default orderService;
