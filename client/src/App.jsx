// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      File: client/src/App.jsx
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all page and layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ProductsPage from './pages/ProductsPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import AddProductPage from './pages/AddProductPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark-gray">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* FIX: Ensure the route for the HomePage is present */}
            <Route path="/" element={<HomePage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Product & Cart Routes */}
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Seller Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/seller/add-product" element={<AddProductPage />} />
            <Route path="/seller/manage-categories" element={<ManageCategoriesPage />} />
            
            {/* Routes for All Products, Search, and Pagination */}
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
