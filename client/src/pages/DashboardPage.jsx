// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      File: client/src/pages/DashboardPage.jsx
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerOrders, resetDashboard } from '../redux/slices/dashboardSlice';
import { FaSpinner, FaDollarSign, FaShoppingCart, FaBoxOpen, FaPlus, FaTags } from 'react-icons/fa';

// FIX: Provide the full component definition instead of a comment
const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-light-gray p-6 rounded-lg shadow-lg flex items-center`}>
        <div className={`p-4 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const DashboardPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { orders, totalSales, totalRevenue, isLoading } = useSelector((state) => state.dashboard);

    useEffect(() => {
        if (!user || user.role !== 'Seller') {
            navigate('/login');
        } else {
            dispatch(getSellerOrders());
        }
        return () => {
            dispatch(resetDashboard());
        }
    }, [user, navigate, dispatch]);

    if (isLoading) return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-primary-orange text-4xl" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-primary-orange">Seller Dashboard</h1>
                <div className="flex space-x-4">
                    <Link to="/seller/manage-categories" className="bg-gray-200 text-dark-gray font-bold px-6 py-3 rounded-md hover:bg-opacity-90 transition-all flex items-center">
                        <FaTags className="mr-2" />
                        Manage Categories
                    </Link>
                    <Link to="/seller/add-product" className="bg-primary-orange text-dark-gray font-bold px-6 py-3 rounded-md hover:bg-opacity-90 transition-all flex items-center">
                        <FaPlus className="mr-2" />
                        Add Product
                    </Link>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={<FaDollarSign size={24} className="text-white"/>} color="bg-green-500" />
                <StatCard title="Total Sales" value={totalSales} icon={<FaShoppingCart size={24} className="text-white"/>} color="bg-blue-500" />
                <StatCard title="Pending Orders" value={orders.filter(o => o.status === 'Pending').length} icon={<FaBoxOpen size={24} className="text-white"/>} color="bg-yellow-500" />
            </div>

            <div className="bg-light-gray p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 10).map(order => (
                                <tr key={order._id} className="border-b border-gray-700 hover:bg-dark-gray">
                                    <td className="p-3 text-sm text-gray-400">{order._id}</td>
                                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">{order.user?.name || 'N/A'}</td>
                                    <td className="p-3 font-bold text-primary-orange">${order.totalAmount.toFixed(2)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${order.status === 'Delivered' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-dark-gray'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
