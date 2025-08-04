import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerOrders, resetDashboard } from '../redux/slices/dashboardSlice';
import { getProducts, deleteProduct, resetProducts } from '../redux/slices/productSlice';
import { FaSpinner, FaEdit, FaTrash, FaPlus, FaTags, FaDollarSign, FaShoppingCart, FaBoxOpen } from 'react-icons/fa';

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
    const { orders, totalSales, totalRevenue, isLoading: dashboardLoading } = useSelector((state) => state.dashboard);
    const { products, isLoading: productsLoading } = useSelector((state) => state.products);

    useEffect(() => {
        if (!user || user.role !== 'Seller') {
            navigate('/login');
        } else {
            dispatch(getSellerOrders());
            dispatch(getProducts({})); 
        }
        return () => {
            dispatch(resetDashboard());
            dispatch(resetProducts());
        }
    }, [user, navigate, dispatch]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    if (dashboardLoading || productsLoading) {
        return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-primary-orange text-4xl" /></div>;
    }

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

            {/* Product List Table */}
            <div className="bg-light-gray p-6 rounded-lg shadow-lg mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Manage Products</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-3">ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(products || []).map(product => (
                            <tr key={product._id} className="border-b border-gray-700">
                                <td className="p-3 text-sm text-gray-400">{product._id}</td>
                                <td className="p-3 text-off-white">{product.name}</td>
                                <td className="p-3 text-primary-orange">${product.price}</td>
                                <td className="p-3 text-off-white">{product.stock}</td>
                                <td className="p-3 flex space-x-3">
                                    <Link to={`/seller/product/${product._id}/edit`}>
                                        <FaEdit className="text-yellow-500 hover:text-yellow-300"/>
                                    </Link>
                                    <button onClick={() => deleteHandler(product._id)}>
                                        <FaTrash className="text-red-500 hover:text-red-300"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardPage;
