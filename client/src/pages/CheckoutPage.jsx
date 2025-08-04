// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      File: client/src/pages/CheckoutPage.jsx
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// FIX: Import the unique resetOrder action
import { createOrder, resetOrder } from '../redux/slices/orderSlice';
import { FaSpinner } from 'react-icons/fa';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { cartItems } = useSelector((state) => state.cart);
    const { order, isLoading, isSuccess, isError, message } = useSelector((state) => state.order);

    useEffect(() => {
        if (isError) {
            alert(message);
        }
        if (isSuccess && order?._id) {
            // We don't have an order success page yet, so let's go home for now
            navigate(`/`); 
            // FIX: Use the unique resetOrder action
            dispatch(resetOrder());
        }
    }, [isSuccess, isError, message, order, navigate, dispatch]);

    const placeOrderHandler = () => {
        dispatch(createOrder({})); 
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0).toFixed(2);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-primary-orange mb-8">Checkout</h1>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold text-white mb-4">Order Items</h2>
                    <div className="space-y-3">
                        {cartItems.map(item => (
                             <div key={item.product._id} className="flex items-center bg-light-gray p-3 rounded-lg">
                                <img src={`https://ehub-c95q.onrender.com${item.product.imageUrl}`} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                                <div className="flex-grow mx-4 text-off-white">{item.product.name}</div>
                                <div className="text-off-white">{item.quantity} x ${item.product.price.toFixed(2)} = <span className="font-bold">${(item.quantity * item.product.price).toFixed(2)}</span></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-light-gray p-6 rounded-lg h-fit">
                    <h2 className="text-2xl font-bold text-white border-b border-gray-600 pb-4">Order Summary</h2>
                    <div className="flex justify-between mt-4 text-lg">
                        <span className="text-gray-300">Items ({totalItems})</span>
                        <span className="font-bold text-off-white">${subtotal}</span>
                    </div>
                    <div className="flex justify-between mt-2 text-lg">
                        <span className="text-gray-300">Shipping</span>
                        <span className="font-bold text-off-white">FREE</span>
                    </div>
                    <div className="flex justify-between mt-4 text-xl border-t border-gray-600 pt-4">
                        <span className="text-gray-300">Total</span>
                        <span className="font-bold text-primary-orange">${subtotal}</span>
                    </div>
                    {isError && <div className="text-red-500 text-center mt-2">{message}</div>}
                    <button 
                        onClick={placeOrderHandler} 
                        className="w-full mt-6 bg-primary-orange text-dark-gray font-bold py-3 rounded-lg text-lg hover:bg-opacity-90 transition-all disabled:bg-gray-500"
                        disabled={cartItems.length === 0 || isLoading}
                    >
                        {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
