import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RoleRedirect from './pages/RoleRedirect';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

import CustomerDashboard from './pages/customer/Dashboard';
import KitchenDashboard from './pages/kitchen/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import RestaurantList from './pages/customer/RestaurantList';
import RestaurantMenu from './pages/customer/RestaurantMenu';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import MyOrders from './pages/customer/MyOrders';
import OrderDashboard from './pages/manager/OrderDashboard';
import MenuManagement from './pages/manager/MenuManagement';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurant/:id" element={<RestaurantMenu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/manager/orders" element={<RoleRoute allowedRoles={['manager']}><OrderDashboard /></RoleRoute>} />
            <Route path="/manager/menu" element={<RoleRoute allowedRoles={['manager']}><MenuManagement /></RoleRoute>} />

            <Route
              path="/customer"
              element={
                <RoleRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/kitchen"
              element={
                <RoleRoute allowedRoles={['kitchen']}>
                  <KitchenDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/manager"
              element={
                <RoleRoute allowedRoles={['manager']}>
                  <ManagerDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              }
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;