import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Categories from './pages/Categories.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Orders from './pages/Orders.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="categories" element={<Categories />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route
          path="orders"
          element={
            <RequireAuth reason="account">
              <Orders />
            </RequireAuth>
          }
        />
        <Route
          path="checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
