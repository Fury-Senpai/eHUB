import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

// Pages
import LoginPage from './Pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ProductsPage from './pages/ProductsPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import AddProductPage from './pages/AddProductPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import EditProductPage from './pages/EditProductPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark-gray">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/seller/add-product" element={<AddProductPage />} />
            <Route path="/seller/manage-categories" element={<ManageCategoriesPage />} />
            <Route path="/seller/product/:id/edit" element={<EditProductPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/page/:pageNumber" element={<ProductsPage />} />
            <Route path="/search/:keyword" element={<ProductsPage />} />
            <Route path="/search/:keyword/page/:pageNumber" element={<ProductsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
