import { Route, Routes } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import NavMenu from './components/NavMenu/index';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/home/index';
import Login from './pages/login/index';
import NotFound from './pages/notFound';
import ProfilePage from './pages/profile/index';
import Register from './pages/register/index';
import Unauthorized from './pages/unauthorized';
// Public Pages
import Menu from './pages/menu';
// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/Products';
import ProductForm from './pages/admin/Products/ProductForm';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-[calc(100vh-70px)]">
        <NavMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Página do Cardápio - PÚBLICA (carrinho só para autenticados) */}
          <Route path="/cardapio" element={<Menu />} />
          <Route path="/menu" element={<Menu />} />
          
          {/* Rotas Administrativas */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <AdminRoute>
                <ProductManagement />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/products/new" 
            element={
              <AdminRoute>
                <ProductForm />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/products/:id/edit" 
            element={
              <AdminRoute>
                <ProductForm />
              </AdminRoute>
            } 
          />
          
          {/* Páginas Informativas */}
          <Route path="/sobre" element={<h1 className="py-24 px-5 text-center">Página Sobre em construção</h1>} />
          <Route path="/contato" element={<h1 className="py-24 px-5 text-center">Página de Contato em construção</h1>} />
          
          {/* Páginas de Erro */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
