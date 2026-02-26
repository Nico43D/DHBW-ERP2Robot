import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AddressManagement from './pages/AddressManagement';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'shop', Component: Shop },
      { path: 'products/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'dashboard', Component: Dashboard },
      { path: 'orders', Component: Orders },
      { path: 'orders/:orderNumber', Component: OrderDetail },
      { path: 'checkout', Component: Checkout },
      { path: 'order-confirmation/:orderNumber', Component: OrderConfirmation },
      { path: 'account/addresses', Component: AddressManagement },
      { path: '*', Component: NotFound },
    ],
  },
]);