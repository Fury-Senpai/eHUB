// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      File: client/src/pages/ProductsPage.jsx
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
                    <div className="flex items-baseline  space-x-2 mt-2   ">
                        <p className={`font-bold text-xl ${product.discount > 0 ? 'text-red-500' : 'text-primary-orange'}`}>${discountedPrice.toFixed(2)}</p>
                        {product.discount > 0 && <p className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</p>}
                    </div>
                </div>
            </div>
        </Link>
    );
};

const Paginate = ({ pages, page, keyword = '' }) => {
    if (pages <= 1) return null;
    return (
        <div className="flex justify-center mt-8">
            {[...Array(pages).keys()].map(x => (
                <Link key={x + 1} to={keyword ? `/search/${keyword}/page/${x + 1}` : `/products/page/${x + 1}`} className={`mx-1 px-4 py-2 rounded-md font-bold ${page === x + 1 ? 'bg-primary-orange text-dark-gray' : 'bg-light-gray text-off-white'}`}>
                    {x + 1}
                </Link>
            ))}
        </div>
    );
};

const ProductsPage = () => {
    const dispatch = useDispatch();
    const { keyword, pageNumber } = useParams();
    const { products, page, pages, isLoading, isError, message } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProducts({ keyword: keyword || '', pageNumber: pageNumber || '' }));
        return () => { dispatch(resetProducts()) };
    }, [dispatch, keyword, pageNumber]);

    // FIX: Provide a fallback empty array to prevent 'filter of undefined' error
    const validProducts = (products || []).filter(p => p && p._id);

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary-orange mb-8">{keyword ? `Search Results for "${keyword}"` : 'All Products'}</h1>
            {isLoading ? <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-primary-orange text-4xl" /></div>
             : isError ? <div className="text-center text-red-500">Error: {message}</div>
             : validProducts.length === 0 ? <div className="text-center text-xl text-off-white">No products found.</div>
             : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{validProducts.map(product => <ProductCard key={product._id} product={product} />)}</div>
                    <Paginate pages={pages} page={page} keyword={keyword} />
                </>
            )}
        </div>
    );
};

export default ProductsPage;
