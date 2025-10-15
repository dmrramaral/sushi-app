import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import CategoriesManagement from './CategoriesManagement';
import CustomersManagement from './CustomersManagement';
import OrdersManagement from './OrdersManagement';
import ProductsManagement from './ProductsManagement';

const AdminPanel = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('products');

  // Lê a query string para definir a aba inicial
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    
    // Mapeamento de nomes da query string para IDs das abas
    const tabMapping = {
      'produtos': 'products',
      'categorias': 'categories',
      'clientes': 'customers',
      'pedidos': 'orders'
    };
    
    if (tab && tabMapping[tab]) {
      setActiveTab(tabMapping[tab]);
    }
  }, [location.search]);

  const tabs = [
    { id: 'products', label: 'Produtos', icon: '📦' },
    { id: 'categories', label: 'Categorias', icon: '🏷️' },
    { id: 'customers', label: 'Clientes', icon: '👥' },
    { id: 'orders', label: 'Pedidos', icon: '🛒' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Painel Administrativo
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Bem-vindo, {user?.name || 'Admin'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto scrollbar-hide space-x-4 sm:space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2
                  transition-colors duration-200 whitespace-nowrap flex-shrink-0
                  ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && <ProductsManagement />}
        {activeTab === 'categories' && <CategoriesManagement />}
        {activeTab === 'customers' && <CustomersManagement />}
        {activeTab === 'orders' && <OrdersManagement />}
      </div>
    </div>
  );
};

export default AdminPanel;
