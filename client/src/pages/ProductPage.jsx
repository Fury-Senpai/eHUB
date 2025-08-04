// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      File: client/src/pages/ProductPage.jsx
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, resetProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { FaSpinner, FaShoppingCart } from 'react-icons/fa';

const ProductPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);

    const { product, isLoading, isError, message } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getProductById(productId));
        return () => {
            dispatch(resetProducts());
        };
    }, [dispatch, productId]);

    const addToCartHandler = () => {
        if (!user) {
            navigate('/login');
        } else {
            const itemData = { productId, quantity: qty };
            dispatch(addToCart(itemData));
            navigate('/cart');
        }
    };

    const discountedPrice = product.price ? product.price * (1 - (product.discount || 0) / 100) : 0;

    if (isLoading || !product.name) {
        return (
            <div className="flex justify-center items-center h-96">
                <FaSpinner className="animate-spin text-primary-orange text-5xl" />
            </div>
        );
    }
    if (isError) {
        return <div className="text-center text-red-500 text-2xl">Error: {message}</div>;
    }

    return (
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div>
                <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-4xl font-bold text-white">{product.name}</h1>
                {/* FIX: Replaced ">" with a span for proper JSX syntax */}
                <Link to={`/category/${product.category?.name}`} className="text-primary-orange hover:underline mt-1">
                    {product.category?.name} <span className="mx-1">{'>'}</span> {product.subCategory}
                </Link>
                <p className="text-gray-300 mt-4 text-lg leading-relaxed">{product.description}</p>
                <div className="my-6">
                    <div className="flex items-baseline space-x-3">
                        <p className={`font-bold text-4xl ${product.discount > 0 ? 'text-red-500' : 'text-primary-orange'}`}>
                            ${discountedPrice.toFixed(2)}
                        </p>
                        {product.discount > 0 && (
                            <p className="text-xl text-gray-400 line-through">${product.price.toFixed(2)}</p>
                        )}
                    </div>
                    {product.discount > 0 && (
                        <div className="mt-2 text-sm font-bold text-white bg-red-600 px-3 py-1 rounded-full inline-block">
                            {product.discount}% OFF
                        </div>
                    )}
                </div>
                <div className="bg-light-gray p-4 rounded-lg mt-auto">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-lg">Status:</span>
                        <span className={`font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                    {product.stock > 0 && (
                        <div className="flex justify-between items-center mb-4">
                            <label htmlFor="qty" className="font-bold text-lg">Qty:</label>
                            <select id="qty" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="bg-dark-gray p-2 rounded border border-gray-600">
                                {[...Array(product.stock).keys()].slice(0, 10).map((x) => (
                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button onClick={addToCartHandler} className="w-full bg-primary-orange text-dark-gray font-bold py-3 rounded-lg flex items-center justify-center text-lg hover:bg-opacity-90 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={product.stock === 0}>
                        <FaShoppingCart className="mr-3" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
