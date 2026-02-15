import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import { ProductProvider } from './ProductContext';

// Components
import NavBar from './NavBar';
import Footer from './Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import './GlobalMobile.css'; // Global mobile optimizations

// Pages - Root
import Home from './pages/Home';
import Products from './Products';
import Cart from './Cart';
import Checkout from './Checkout';
import OrderConfirmation from './OrderConfirmation';
import ProductDetails from './ProductDetails';
import AllReviews from './AllReviews';
import SearchResults from './SearchResults';

// Specialized Pages
import About from './components/About';
import Contact from './components/Contact_Us';
import AdminDashboard from './admin/pages/DashboardHome';
import AdminOrders from './admin/pages/AdminOrders';
import UsersManager from './admin/pages/UsersManager';
import AddProduct from './admin/pages/AddProduct';
import ManageProducts from './admin/pages/ManageProducts';
import EditProduct from './admin/pages/EditProduct';
import ManageReviews from './admin/pages/ManageReviews';
import Settings from './admin/pages/Settings';
import AdminLayout from './admin/components/AdminLayout';

// Pages - Subfolders
import Categories from './pages/Categories';
import ProductsByCategory from './pages/ProductsByCategory';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Users_Login Pages (if needed)
import Login from './Users_Login/Login';
import Register from './Users_Login/Register';
import VerifyEmail from './Users_Login/VerifyEmail';

// Layout Wrapper to Conditionally Hide NavBar/Footer/CartDrawer
const Layout = ({ children }) => {
  return <InnerLayout>{children}</InnerLayout>;
};

const InnerLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');


  return (
    <div className="app-container">
      <ScrollToTop />
      {!isAdminPath && <NavBar />}
      {!isAdminPath && <CartDrawer />}

      <main className={isAdminPath ? "admin-content" : "main-content"}>
        {children}
      </main>

      {!isAdminPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ProductProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:categoryName" element={<ProductsByCategory />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/reviews" element={<AllReviews />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/admin/dashboard" element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              } />
              <Route path="/admin/orders" element={
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              } />
              <Route path="/admin/users" element={
                <AdminLayout>
                  <UsersManager />
                </AdminLayout>
              } />
              <Route path="/admin/products" element={
                <AdminLayout>
                  <ManageProducts />
                </AdminLayout>
              } />
              <Route path="/admin/products/create" element={
                <AdminLayout>
                  <AddProduct />
                </AdminLayout>
              } />
              <Route path="/admin/products/edit/:id" element={
                <AdminLayout>
                  <EditProduct />
                </AdminLayout>
              } />
              <Route path="/admin/reviews" element={
                <AdminLayout>
                  <ManageReviews />
                </AdminLayout>
              } />
              <Route path="/admin/settings" element={
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

              {/* Fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </ProductProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
