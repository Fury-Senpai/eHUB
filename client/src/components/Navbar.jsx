
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// FIX: Import the unique resetAuth action
import { logout, resetAuth } from '../redux/slices/authSlice';
import { FaSignOutAlt, FaSignInAlt, FaUserPlus, FaTachometerAlt, FaShoppingCart, FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [keyword, setKeyword] = useState('');

  const onLogout = () => {
    dispatch(logout());
    // FIX: Dispatch the unique resetAuth action
    dispatch(resetAuth());
    navigate('/login');
  };
  
  const searchHandler = (e) => {
      e.preventDefault();
      if(keyword.trim()) {
          navigate(`/search/${keyword}`);
      } else {
          navigate('/products');
      }
      setKeyword('');
  }

  const authLinks = (
    <div className="flex items-center space-x-6">
      {user?.role === 'Seller' && (
         <Link to="/dashboard" className="flex items-center text-off-white hover:text-primary-orange transition-colors"><FaTachometerAlt className="mr-2" />Dashboard</Link>
      )}
      <Link to="/cart" className="flex items-center text-off-white hover:text-primary-orange transition-colors"><FaShoppingCart className="mr-2" />Cart</Link>
      <span className="text-off-white font-semibold">Hello, {user?.name.split(' ')[0]}</span>
      <button onClick={onLogout} className="flex items-center text-off-white hover:text-primary-orange transition-colors"><FaSignOutAlt className="mr-2" />Logout</button>
    </div>
  );

  const guestLinks = (
    <div className="flex items-center space-x-6">
      <Link to="/login" className="flex items-center bg-primary-orange text-dark-gray font-bold px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"><FaSignInAlt className="mr-2" />Sign In</Link>
      <Link to="/register" className="flex items-center text-off-white hover:text-primary-orange transition-colors"><FaUserPlus className="mr-2" />Sign Up</Link>
    </div>
  );

  return (
    <nav className="bg-light-gray shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary-orange">eHUB</Link>
          
          <form onSubmit={searchHandler} className="flex-1 max-w-xl mx-4 flex">
            <input
              type="text"
              name="q"
              onChange={(e) => setKeyword(e.target.value)}
              value={keyword}
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-l-md bg-dark-gray text-off-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            />
            <button type="submit" className="px-4 py-2 bg-primary-orange text-dark-gray rounded-r-md"><FaSearch /></button>
          </form>

          <div className="flex items-center space-x-6">
            <Link to="/products" className="text-off-white hover:text-primary-orange transition-colors">Products</Link>
            {user ? authLinks : guestLinks}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
  