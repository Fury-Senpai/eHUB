// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      File: client/src/pages/HomePage.jsx
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, resetProducts } from '../redux/slices/productSlice';
import { FaSpinner } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
    return (
        <Link to={`/product/${product._id}`} className="block">
            <div className="bg-light-gray rounded-lg p-4 flex flex-col justify-between shadow-md transition-transform hover:scale-105 h-full">
                <img src={`https://ehub-c95q.onrender.com${product.imageUrl}`} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
                <div className="flex-grow flex flex-col justify-end">
                    <h3 className="font-bold text-lg text-off-white truncate">{product.name}</h3>
                    <div className="flex items-baseline  space-x-2 mt-2">
                        <p className={`font-bold text-xl ${product.discount > 0 ? 'text-red-500' : 'text-primary-orange'}`}>{`$${discountedPrice.toFixed(2)}`}</p>
                        {product.discount > 0 && <p className="text-sm text-gray-400 line-through">{`$${product.price.toFixed(2)}`}</p>}
                    </div>
                </div>
            </div>
        </Link>
    );
};

const HomePage = () => {
    const dispatch = useDispatch();
    const { products, isLoading, isError, message } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProducts({})); 
        return () => {
            dispatch(resetProducts());
        }
    }, [dispatch]);

    const validProducts = (products || []).filter(p => p && p._id);
    const discountedProducts = validProducts.filter(p => p.discount > 0).slice(0, 4);
    const mostPurchasedProducts = [...validProducts].sort((a, b) => b.purchaseCount - a.purchaseCount).slice(0, 4);

    if (isLoading) return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-primary-orange text-4xl" /></div>;
    if (isError) return <div className="text-center text-red-500">Error: {message}</div>;

    return (
        <div className="space-y-16">
            {/* Updated Banner Section */}
            <section 
                className="relative bg-cover bg-center rounded-lg p-8 md:p-12 text-center shadow-lg text-white"
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/banner-1.png')` }}
            >
                <h1 className="text-4xl md:text-5xl font-bold">
                    Epic Deals are Here!
                </h1>
                <p className="text-lg text-gray-200 mt-4 max-w-2xl mx-auto">
                    Get up to <span className="text-primary-orange font-bold">50% OFF</span> on the latest tech, gadgets, and more.
                </p>
                <button className="mt-8 bg-primary-orange text-dark-gray font-bold px-8 py-3 rounded-md hover:bg-opacity-90 transition-all text-lg">
                    Shop All Deals
                </button>
            </section>

            {/* Discounted Products Section */}
            {discountedProducts.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold text-primary-orange mb-6">On Sale</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{discountedProducts.map(product => <ProductCard key={product._id} product={product} />)}</div>
                </section>
            )}
            
            {/* Most Purchased Section */}
            {mostPurchasedProducts.length > 0 && (
                 <section>
                    <h2 className="text-3xl font-bold text-primary-orange mb-6">Most Popular</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{mostPurchasedProducts.map(product => <ProductCard key={product._id} product={product} />)}</div>
                </section>
            )}

            {/* All Products Section */}
            <section>
                <h2 className="text-3xl font-bold text-primary-orange mb-6">All Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{validProducts.map(product => <ProductCard key={product._id} product={product} />)}</div>
            </section>
        </div>
    );
};

export default HomePage;
