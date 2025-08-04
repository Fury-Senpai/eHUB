// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      File: client/src/pages/CartPage.jsx
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// FIX: Import the unique resetCart action
import { getCart, removeFromCart, resetCart } from '../redux/slices/cartSlice';
import { FaTrash, FaSpinner } from 'react-icons/fa';

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { cartItems, isLoading } = useSelector((state) => state.cart);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            dispatch(getCart());
        }
        // FIX: Use the unique resetCart action in the cleanup
        return () => {
            dispatch(resetCart());
        }
    }, [user, navigate, dispatch]);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/checkout');
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0).toFixed(2);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-primary-orange text-4xl" /></div>;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary-orange mb-8">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="text-center bg-light-gray p-8 rounded-lg">
                    <p className="text-xl text-off-white">Your cart is empty.</p>
                    <Link to="/" className="text-primary-orange hover:underline mt-4 inline-block">Go Shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.product._id} className="flex items-center bg-light-gray p-4 rounded-lg">
                                <img src={`http://localhost:5000${item.product.imageUrl}`} alt={item.product.name} className="w-24 h-24 object-cover rounded-md" />
                                <div className="flex-grow mx-4">
                                    <Link to={`/product/${item.product._id}`} className="text-lg font-bold text-off-white hover:text-primary-orange">{item.product.name}</Link>
                                    <p className="text-primary-orange font-semibold">${item.product.price.toFixed(2)}</p>
                                </div>
                                <div className="w-20 text-center text-off-white">Qty: {item.quantity}</div>
                                <button onClick={() => removeFromCartHandler(item.product._id)} className="text-gray-400 hover:text-red-500"><FaTrash size={20} /></button>
                            </div>
                        ))}
                    </div>
                    <div className="bg-light-gray p-6 rounded-lg h-fit">
                        <h2 className="text-2xl font-bold text-white border-b border-gray-600 pb-4">Order Summary</h2>
                        <div className="flex justify-between mt-4 text-lg">
                            <span className="text-gray-300">Subtotal ({totalItems} items)</span>
                            <span className="font-bold text-off-white">${subtotal}</span>
                        </div>
                        <button onClick={checkoutHandler} className="w-full mt-6 bg-primary-orange text-dark-gray font-bold py-3 rounded-lg text-lg hover:bg-opacity-90 transition-all">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
