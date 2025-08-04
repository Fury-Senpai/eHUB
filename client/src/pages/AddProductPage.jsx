
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, resetProducts } from '../redux/slices/productSlice';
import { getCategories, resetCategories } from '../redux/slices/categorySlice';
import { FaSpinner } from 'react-icons/fa';

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [description, setDescription] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.auth);
   
    const { categories } = useSelector(state => state.categories);
    const { isLoading, isError, isSuccess, message } = useSelector(state => state.products);

    useEffect(() => {
        if (!user || user.role !== 'Seller') {
            navigate('/login');
        }
        
        dispatch(getCategories());

        if (isError) {
            alert(message);
        }

        if (isSuccess) {
            alert('Product Created Successfully!');
            navigate('/dashboard');
        }

        return () => {
            dispatch(resetProducts());
            dispatch(resetCategories());
        }
    }, [user, navigate, isError, isSuccess, message, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        const productData = new FormData();
        productData.append('name', name);
        productData.append('price', price);
        productData.append('image', image);
        productData.append('category', categoryId);
        productData.append('subCategory', subCategory);
        productData.append('stock', stock);
        productData.append('discount', discount);
        productData.append('description', description);

        dispatch(createProduct(productData));
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-primary-orange mb-8">Add New Product</h1>
            <form onSubmit={submitHandler} className="space-y-6 bg-light-gray p-8 rounded-lg">
                <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Product Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Price ($)</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange" required />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Stock Quantity</label>
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange" required />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Category</label>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange" >
                            <option value="">Select Category</option>
                            {categories && categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Sub-Category</label>
                        <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange"  disabled={!categoryId}>
                             <option value="">Select Sub-Category</option>
                             {categoryId && categories && categories.find(c => c._id === categoryId)?.subCategories.map(sub => <option key={sub.name} value={sub.name}>{sub.name}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Discount (%)</label>
                    <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full p-3 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange" />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Product Image</label>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-orange file:text-dark-gray hover:file:bg-opacity-90" required />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-300 block mb-2">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-3 bg-dark-gray rounded border border-gray-600 focus:border-primary-orange" required></textarea>
                </div>
                <div>
                    <button type="submit" className="w-full py-3 font-bold text-dark-gray bg-primary-orange rounded hover:bg-opacity-90 transition-all flex justify-center items-center" disabled={isLoading}>
                        {isLoading ? <FaSpinner className="animate-spin" /> : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductPage;
